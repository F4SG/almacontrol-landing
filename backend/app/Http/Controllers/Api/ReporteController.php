<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Inventario;
use App\Models\MovimientoInventario;
use Illuminate\Http\Request;

class ReporteController extends Controller
{
    // GET /api/reportes/inventario-csv
    public function inventarioCsv()
    {
        $inventario = Inventario::with(['producto.categoria', 'almacen'])
            ->get();

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="inventario_' . now()->format('Ymd_His') . '.csv"',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        $callback = function () use ($inventario) {
            $handle = fopen('php://output', 'w');
            // BOM para Excel en Windows
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            // Encabezados
            fputcsv($handle, [
                'Producto', 'Categoría', 'Almacén',
                'Cantidad', 'Stock Mínimo', 'Estado',
                'Última Actualización',
            ]);

            foreach ($inventario as $inv) {
                $cantidad   = $inv->cantidad;
                $minimo     = $inv->producto->stock_minimo ?? 0;
                $estado     = $cantidad === 0 ? 'Sin Stock'
                    : ($cantidad <= $minimo ? 'Stock Bajo' : 'Normal');

                fputcsv($handle, [
                    $inv->producto->nombre    ?? '—',
                    $inv->producto->categoria->nombre ?? '—',
                    $inv->almacen->nombre     ?? '—',
                    $cantidad,
                    $minimo,
                    $estado,
                    $inv->ultima_actualizacion
                        ? \Carbon\Carbon::parse($inv->ultima_actualizacion)->format('d/m/Y H:i')
                        : '—',
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }

    // GET /api/reportes/movimientos-csv
    public function movimientosCsv(Request $request)
    {
        $query = MovimientoInventario::with(['producto', 'almacen', 'usuario'])
            ->orderBy('fecha', 'desc');

        if ($request->filled('fecha_desde')) {
            $query->whereDate('fecha', '>=', $request->fecha_desde);
        }
        if ($request->filled('fecha_hasta')) {
            $query->whereDate('fecha', '<=', $request->fecha_hasta);
        }
        if ($request->filled('tipo')) {
            $query->where('tipo_movimiento', $request->tipo);
        }

        $movimientos = $query->get();

        $headers = [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="movimientos_' . now()->format('Ymd_His') . '.csv"',
            'Pragma'              => 'no-cache',
            'Cache-Control'       => 'must-revalidate, post-check=0, pre-check=0',
            'Expires'             => '0',
        ];

        $callback = function () use ($movimientos) {
            $handle = fopen('php://output', 'w');
            fprintf($handle, chr(0xEF).chr(0xBB).chr(0xBF));

            fputcsv($handle, [
                'Fecha', 'Tipo', 'Producto', 'Almacén',
                'Cantidad', 'Stock Antes', 'Stock Después',
                'Usuario', 'Observaciones',
            ]);

            foreach ($movimientos as $m) {
                fputcsv($handle, [
                    \Carbon\Carbon::parse($m->fecha)->format('d/m/Y H:i'),
                    $m->tipo_movimiento,
                    $m->producto->nombre   ?? '—',
                    $m->almacen->nombre    ?? '—',
                    $m->cantidad,
                    $m->stock_antes,
                    $m->stock_despues,
                    ($m->usuario->nombre ?? '') . ' ' . ($m->usuario->apellido ?? ''),
                    $m->observaciones ?? '',
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
