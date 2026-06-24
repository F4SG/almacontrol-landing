<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DetalleOrden;
use App\Models\Ordenes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrdenController extends Controller
{
    // GET /api/ordenes
    public function index()
    {
        $ordenes = Ordenes::with(['tipoOrden', 'usuario', 'almacenOrigen', 'detalles.producto'])
            ->orderBy('fecha_orden', 'desc')
            ->paginate(15);

        return response()->json($ordenes);
    }

    // POST /api/ordenes
    public function store(Request $request)
    {
        $data = $request->validate([
            'id_tipo_orden'       => 'required|integer|exists:tipo_orden,id_tipo_orden',
            'id_almacen_origen'   => 'required|integer|exists:almacen,id_almacen',
            'id_almacen_destino'  => 'nullable|integer|exists:almacen,id_almacen',
            'observaciones'       => 'nullable|string',
            'detalles'            => 'required|array|min:1',
            'detalles.*.id_producto'   => 'required|integer|exists:producto,id_producto',
            'detalles.*.cantidad'      => 'required|integer|min:1',
            'detalles.*.precio_unitario'=> 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($data, $request) {
            $orden = Ordenes::create([
                'id_tipo_orden'      => $data['id_tipo_orden'],
                'id_almacen_origen'  => $data['id_almacen_origen'],
                'id_almacen_destino' => $data['id_almacen_destino'] ?? null,
                'id_usuario'         => $request->user()->id_usuario,
                'numero_documento'   => 'TEMP',
                'estado'             => 'PENDIENTE',
                'observaciones'      => $data['observaciones'] ?? null,
                'fecha_orden'        => now(),
            ]);

            // Generar número de documento con el ID real
            $orden->update([
                'numero_documento' => 'ORD-' . date('Ymd') . '-' . str_pad($orden->id_orden, 4, '0', STR_PAD_LEFT),
            ]);

            // Crear detalles
            foreach ($data['detalles'] as $detalle) {
                DetalleOrden::create([
                    'id_orden'       => $orden->id_orden,
                    'id_producto'    => $detalle['id_producto'],
                    'id_lote'        => $detalle['id_lote'] ?? null,
                    'cantidad'       => $detalle['cantidad'],
                    'precio_unitario'=> $detalle['precio_unitario'],
                ]);
            }

            $orden->load(['tipoOrden', 'usuario', 'almacenOrigen', 'detalles.producto']);

            return response()->json($orden, 201);
        });
    }

    // GET /api/ordenes/{id}
    public function show($id)
    {
        $orden = Ordenes::with([
            'tipoOrden', 'usuario', 'almacenOrigen', 'almacenDestino', 'detalles.producto',
        ])->findOrFail($id);

        return response()->json($orden);
    }

    // PUT /api/ordenes/{id}/estado
    public function cambiarEstado(Request $request, $id)
    {
        $orden = Ordenes::findOrFail($id);

        $data = $request->validate([
            'estado' => 'required|in:PROCESADA,ANULADA',
        ]);

        if ($orden->estado !== 'PENDIENTE') {
            return response()->json([
                'message' => "No se puede cambiar el estado de una orden {$orden->estado}",
            ], 422);
        }

        $orden->update([
            'estado'          => $data['estado'],
            'fecha_procesada' => now(),
        ]);

        return response()->json($orden);
    }
}
