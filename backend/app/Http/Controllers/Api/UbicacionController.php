<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Almacen;
use App\Models\Ubicacion;
use Illuminate\Http\Request;

class UbicacionController extends Controller
{
    // GET /api/almacenes/{id}/ubicaciones
    public function index($almacenId)
    {
        $almacen = Almacen::findOrFail($almacenId);

        $ubicaciones = Ubicacion::where('id_almacen', $almacenId)
            ->orderBy('pasillo')
            ->orderBy('estante')
            ->orderBy('nivel')
            ->get();

        return response()->json($ubicaciones);
    }

    // POST /api/almacenes/{id}/ubicaciones
    public function store(Request $request, $almacenId)
    {
        Almacen::findOrFail($almacenId);

        $data = $request->validate([
            'pasillo'       => 'required|string|max:50',
            'estante'       => 'required|string|max:50',
            'nivel'         => 'required|string|max:50',
            'capacidad_max' => 'nullable|integer|min:0',
        ]);

        $data['id_almacen'] = $almacenId;

        $ubicacion = Ubicacion::create($data);

        return response()->json($ubicacion, 201);
    }

    // DELETE /api/ubicaciones/{id}
    public function destroy($id)
    {
        $ubicacion = Ubicacion::findOrFail($id);
        $ubicacion->delete();

        return response()->json(['message' => 'Ubicación eliminada correctamente']);
    }
}
