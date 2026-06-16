<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerta;
use Illuminate\Http\Request;

class AlertaController extends Controller
{
    // GET /api/alertas → solo no leídas
    public function index()
    {
        $alertas = Alerta::with(['producto', 'almacen'])
            ->where('leida', 0)
            ->orderBy('fecha_generada', 'desc')
            ->get();

        return response()->json($alertas);
    }

    // PUT /api/alertas/{id}/leer
    public function leer($id)
    {
        $alerta = Alerta::findOrFail($id);
        $alerta->update([
            'leida'      => 1,
            'fecha_leida'=> now(),
        ]);

        return response()->json($alerta);
    }

    // PUT /api/alertas/leer-todas
    public function leerTodas()
    {
        Alerta::where('leida', 0)->update([
            'leida'      => 1,
            'fecha_leida'=> now(),
        ]);

        return response()->json(['message' => 'Todas las alertas marcadas como leídas']);
    }
}
