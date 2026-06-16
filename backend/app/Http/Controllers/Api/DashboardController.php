<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerta;
use App\Models\Almacen;
use App\Models\Inventario;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $totalProductos  = Producto::where('activo', 1)->count();
        $totalAlmacenes  = Almacen::where('activo', 1)->count();
        $alertasSinLeer  = Alerta::where('leida', 0)->count();
        $movimientosHoy  = MovimientoInventario::whereDate('fecha', today())->count();

        // Stock crítico: productos donde cantidad <= stock_minimo
        $stockCritico = DB::table('inventario as i')
            ->join('producto as p', 'p.id_producto', '=', 'i.id_producto')
            ->join('almacen as a', 'a.id_almacen', '=', 'i.id_almacen')
            ->where('p.activo', 1)
            ->whereRaw('i.cantidad <= p.stock_minimo')
            ->select(
                'p.id_producto',
                'p.nombre',
                'i.cantidad as stock_actual',
                'p.stock_minimo',
                'a.nombre as almacen'
            )
            ->limit(10)
            ->get();

        return response()->json([
            'total_productos' => $totalProductos,
            'total_almacenes' => $totalAlmacenes,
            'alertas_sin_leer'=> $alertasSinLeer,
            'movimientos_hoy' => $movimientosHoy,
            'stock_critico'   => $stockCritico,
        ]);
    }
}
