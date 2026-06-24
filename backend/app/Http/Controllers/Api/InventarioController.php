<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerta;
use App\Models\Inventario;
use App\Models\Lote;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Http\Request;

class InventarioController extends Controller
{
    // GET /api/inventario
    public function index(Request $request)
    {
        $idEmpresa = $request->user()->id_empresa;

        // Obtenemos SOLO los IDs de productos que pertenecen a esta empresa
        $productoIds = Producto::where('id_empresa', $idEmpresa)->pluck('id_producto');

        $query = Inventario::with(['producto.categoria', 'almacen'])
            ->whereIn('id_producto', $productoIds);

        if ($request->filled('almacen_id')) {
            $query->where('id_almacen', $request->almacen_id);
        }
        if ($request->filled('producto_id')) {
            $query->where('id_producto', $request->producto_id);
        }

        return response()->json($query->get());
    }

    // POST /api/inventario/entrada
    public function entrada(Request $request)
    {
        $data = $request->validate([
            'id_producto'   => 'required|integer|exists:producto,id_producto',
            'id_almacen'    => 'required|integer|exists:almacen,id_almacen',
            'cantidad'      => 'required|integer|min:1',
            'observaciones' => 'nullable|string',
            'id_lote'       => 'nullable|integer|exists:lote,id_lote',
        ]);

        // Buscar o crear registro de inventario
        $inventario = Inventario::firstOrCreate(
            ['id_producto' => $data['id_producto'], 'id_almacen' => $data['id_almacen']],
            ['cantidad' => 0, 'ultima_actualizacion' => now()]
        );

        $stockAntes  = $inventario->cantidad;
        $stockDespues = $stockAntes + $data['cantidad'];

        $inventario->update([
            'cantidad'            => $stockDespues,
            'ultima_actualizacion'=> now(),
        ]);

        // Registrar movimiento
        $movimiento = MovimientoInventario::create([
            'id_empresa'     => $request->user()->id_empresa,
            'id_producto'    => $data['id_producto'],
            'id_almacen'     => $data['id_almacen'],
            'id_lote'        => $data['id_lote'] ?? null,
            'id_usuario'     => $request->user()->id_usuario,
            'tipo_movimiento'=> 'ENTRADA',
            'cantidad'       => $data['cantidad'],
            'stock_antes'    => $stockAntes,
            'stock_despues'  => $stockDespues,
            'observaciones'  => $data['observaciones'] ?? null,
            'fecha'          => now(),
            'sincronizado'   => 0,
        ]);

        // Actualizar lote si aplica
        if (! empty($data['id_lote'])) {
            $lote = Lote::where('id_lote', $data['id_lote'])->first();
            if ($lote) {
                $lote->increment('cantidad_actual', $data['cantidad']);

                // Alerta de vencimiento próximo (≤ 30 días)
                if ($lote->fecha_vencimiento) {
                    $diasParaVencer = now()->diffInDays($lote->fecha_vencimiento, false);
                    if ($diasParaVencer >= 0 && $diasParaVencer <= 30) {
                        $producto = Producto::find($data['id_producto']);
                        Alerta::firstOrCreate(
                            [
                                'id_producto' => $data['id_producto'],
                                'id_almacen'  => $data['id_almacen'],
                                'tipo_alerta' => 'VENCIMIENTO_PROXIMO',
                                'leida'       => 0,
                            ],
                            [
                                'id_empresa'     => $request->user()->id_empresa,
                                'mensaje'        => "Vencimiento próximo: {$producto?->nombre} vence el {$lote->fecha_vencimiento} ({$diasParaVencer} días restantes)",
                                'fecha_generada' => now(),
                            ]
                        );
                    }
                }
            }
        }

        $movimiento->load(['producto', 'almacen', 'usuario']);

        return response()->json($movimiento, 201);
    }

    // POST /api/inventario/salida
    public function salida(Request $request)
    {
        $data = $request->validate([
            'id_producto'   => 'required|integer|exists:producto,id_producto',
            'id_almacen'    => 'required|integer|exists:almacen,id_almacen',
            'cantidad'      => 'required|integer|min:1',
            'observaciones' => 'nullable|string',
            'id_lote'       => 'nullable|integer|exists:lote,id_lote',
        ]);

        $inventario = Inventario::where('id_producto', $data['id_producto'])
            ->where('id_almacen', $data['id_almacen'])
            ->first();

        $disponible = $inventario ? $inventario->cantidad : 0;

        if ($disponible < $data['cantidad']) {
            return response()->json([
                'message' => "Stock insuficiente. Disponible: {$disponible}, solicitado: {$data['cantidad']}",
            ], 422);
        }

        $stockAntes   = $inventario->cantidad;
        $stockDespues = $stockAntes - $data['cantidad'];

        $inventario->update([
            'cantidad'            => $stockDespues,
            'ultima_actualizacion'=> now(),
        ]);

        // Registrar movimiento
        $movimiento = MovimientoInventario::create([
            'id_empresa'     => $request->user()->id_empresa,
            'id_producto'    => $data['id_producto'],
            'id_almacen'     => $data['id_almacen'],
            'id_lote'        => $data['id_lote'] ?? null,
            'id_usuario'     => $request->user()->id_usuario,
            'tipo_movimiento'=> 'SALIDA',
            'cantidad'       => $data['cantidad'],
            'stock_antes'    => $stockAntes,
            'stock_despues'  => $stockDespues,
            'observaciones'  => $data['observaciones'] ?? null,
            'fecha'          => now(),
            'sincronizado'   => 0,
        ]);

        // Actualizar lote si aplica
        if (! empty($data['id_lote'])) {
            Lote::where('id_lote', $data['id_lote'])
                ->decrement('cantidad_actual', $data['cantidad']);
        }

        // Generar alertas automáticas
        $producto = Producto::find($data['id_producto']);

        if ($stockDespues === 0) {
            Alerta::create([
                'id_empresa'    => $request->user()->id_empresa,
                'id_producto'   => $data['id_producto'],
                'id_almacen'    => $data['id_almacen'],
                'tipo_alerta'   => 'STOCK_CERO',
                'mensaje'       => "Stock en cero: {$producto->nombre} en almacén ID {$data['id_almacen']}",
                'leida'         => 0,
                'fecha_generada'=> now(),
            ]);
        } elseif ($producto && $stockDespues <= $producto->stock_minimo) {
            Alerta::create([
                'id_empresa'    => $request->user()->id_empresa,
                'id_producto'   => $data['id_producto'],
                'id_almacen'    => $data['id_almacen'],
                'tipo_alerta'   => 'STOCK_MINIMO',
                'mensaje'       => "Stock mínimo alcanzado: {$producto->nombre} tiene {$stockDespues} unidades (mínimo: {$producto->stock_minimo})",
                'leida'         => 0,
                'fecha_generada'=> now(),
            ]);
        }

        $movimiento->load(['producto', 'almacen', 'usuario']);

        return response()->json($movimiento);
    }

    // GET /api/movimientos
    public function movimientos(Request $request)
    {
        $idEmpresa = $request->user()->id_empresa;

        $query = MovimientoInventario::with(['producto', 'almacen', 'usuario'])
            ->where('id_empresa', $idEmpresa)
            ->orderBy('fecha', 'desc');

        if ($request->filled('almacen_id')) {
            $query->where('id_almacen', $request->almacen_id);
        }
        if ($request->filled('tipo')) {
            $query->where('tipo_movimiento', $request->tipo);
        }
        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha', '<=', $request->fecha_hasta);
        }

        return response()->json($query->paginate(20));
    }
}
