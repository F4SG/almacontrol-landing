<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Proveedor;
use Illuminate\Http\Request;

class ProveedorController extends Controller
{
    // GET /api/proveedores
    public function index()
    {
        $proveedores = Proveedor::where('activo', 1)
            ->orderBy('nombre')
            ->get();

        return response()->json($proveedores);
    }

    // POST /api/proveedores
    public function store(Request $request)
    {
        $data = $request->validate([
            'id_empresa' => 'nullable|integer|exists:empresa,id_empresa',
            'nombre'     => 'required|string|max:200',
            'nit'        => 'nullable|string|max:50',
            'contacto'   => 'nullable|string|max:200',
            'telefono'   => 'nullable|string|max:20',
            'correo'     => 'nullable|email|max:150',
            'direccion'  => 'nullable|string|max:300',
            'activo'     => 'nullable|boolean',
        ]);

        if (empty($data['id_empresa'])) {
            $empresa = \App\Models\Empresa::first();
            if (!$empresa) {
                $empresa = \App\Models\Empresa::create(['razon_social' => 'Mi Empresa', 'nit' => '0']);
            }
            $data['id_empresa'] = $empresa->id_empresa;
        }

        $proveedor = Proveedor::create($data);

        return response()->json($proveedor, 201);
    }

    // PUT /api/proveedores/{id}
    public function update(Request $request, $id)
    {
        $proveedor = Proveedor::findOrFail($id);

        $data = $request->validate([
            'nombre'    => 'sometimes|required|string|max:200',
            'nit'       => 'nullable|string|max:50',
            'contacto'  => 'nullable|string|max:200',
            'telefono'  => 'nullable|string|max:20',
            'correo'    => 'nullable|email|max:150',
            'direccion' => 'nullable|string|max:300',
            'activo'    => 'nullable|boolean',
        ]);

        $proveedor->update($data);

        return response()->json($proveedor);
    }

    // DELETE /api/proveedores/{id} → desactivar
    public function destroy($id)
    {
        $proveedor = Proveedor::findOrFail($id);
        $proveedor->update(['activo' => 0]);

        return response()->json(['message' => 'Proveedor desactivado correctamente']);
    }
}
