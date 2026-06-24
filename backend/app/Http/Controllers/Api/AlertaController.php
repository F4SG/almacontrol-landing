<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Alerta;
use Illuminate\Http\Request;

class AlertaController extends Controller
{
    // GET /api/alertas → solo no leídas de la empresa
    public function index()
    {
        $idEmpresa = request()->user()->id_empresa;

        $alertas = Alerta::with(['producto', 'almacen'])
            ->where('id_empresa', $idEmpresa)
            ->where('leida', 0)
            ->orderBy('fecha_generada', 'desc')
            ->get();

        return response()->json($alertas);
    }

    // PUT /api/alertas/{id}/leer
    public function leer($id)
    {
        $idEmpresa = request()->user()->id_empresa;
        $alerta = Alerta::where('id_empresa', $idEmpresa)->findOrFail($id);
        $alerta->update([
            'leida'      => 1,
            'fecha_leida'=> now(),
        ]);

        return response()->json($alerta);
    }

    // PUT /api/alertas/leer-todas
    public function leerTodas()
    {
        $idEmpresa = request()->user()->id_empresa;

        Alerta::where('id_empresa', $idEmpresa)
              ->where('leida', 0)
              ->update([
                  'leida'      => 1,
                  'fecha_leida'=> now(),
              ]);

        return response()->json(['message' => 'Todas las alertas marcadas como leídas']);
    }
}
