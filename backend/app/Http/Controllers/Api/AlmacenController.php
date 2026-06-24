<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Almacen;
use Illuminate\Http\Request;

class AlmacenController extends Controller
{
    // GET /api/almacenes
    public function index()
    {
        $almacenes = Almacen::with('empresa')
            ->where('activo', 1)
            ->orderBy('nombre')
            ->get();

        return response()->json($almacenes);
    }

    // POST /api/almacenes
    public function store(Request $request)
    {
        $data = $request->validate([
            'id_empresa'  => 'nullable|integer|exists:empresa,id_empresa',
            'nombre'      => 'required|string|max:200',
            'direccion'   => 'nullable|string|max:300',
            'responsable' => 'nullable|string|max:200',
            'activo'      => 'nullable|boolean',
        ]);

        // Si no se envía empresa, usar 1 por defecto o crear una vacía
        if (empty($data['id_empresa'])) {
            // Crear empresa placeholder si no existe ninguna
            $empresa = \App\Models\Empresa::first();
            if (!$empresa) {
                $empresa = \App\Models\Empresa::create([
                    'razon_social' => 'Mi Empresa',
                    'nit'          => '0',
                ]);
            }
            $data['id_empresa'] = $empresa->id_empresa;
        }

        $almacen = Almacen::create($data);
        $almacen->load('empresa');

        return response()->json($almacen, 201);
    }

    // GET /api/almacenes/{id}
    public function show($id)
    {
        $almacen = Almacen::with(['empresa', 'ubicaciones'])->findOrFail($id);

        return response()->json($almacen);
    }

    // PUT /api/almacenes/{id}
    public function update(Request $request, $id)
    {
        $almacen = Almacen::findOrFail($id);

        $data = $request->validate([
            'nombre'      => 'sometimes|required|string|max:200',
            'direccion'   => 'nullable|string|max:300',
            'responsable' => 'nullable|string|max:200',
            'activo'      => 'nullable|boolean',
        ]);

        $almacen->update($data);
        $almacen->load('empresa');

        return response()->json($almacen);
    }

    // DELETE /api/almacenes/{id} → desactivar
    public function destroy($id)
    {
        $almacen = Almacen::findOrFail($id);
        $almacen->update(['activo' => 0]);

        return response()->json(['message' => 'Almacén desactivado correctamente']);
    }
}
