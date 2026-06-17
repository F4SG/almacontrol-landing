<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductoRequest;
use App\Models\Inventario;
use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    // GET /api/productos
    public function index()
    {
        $productos = Producto::with(['categoria', 'proveedor'])
            ->orderBy('nombre')
            ->paginate(15);

        return response()->json($productos);
    }

    // GET /api/productos/buscar?codigo=XXX
    public function buscar(Request $request)
    {
        $codigo = trim($request->get('codigo', ''));

        if ($codigo === '') {
            return response()->json(['message' => 'Se requiere el parámetro código'], 422);
        }

        $producto = Producto::buscarPorCodigo($codigo)?->load(['categoria', 'proveedor']);

        if (!$producto) {
            return response()->json(['message' => 'Producto no encontrado con ese código'], 404);
        }

        // Stock por almacén
        $stockPorAlmacen = Inventario::with('almacen')
            ->where('id_producto', $producto->id_producto)
            ->get()
            ->map(fn($inv) => [
                'id_almacen' => $inv->id_almacen,
                'almacen'    => $inv->almacen->nombre ?? 'Sin almacén',
                'cantidad'   => $inv->cantidad,
            ]);

        return response()->json([
            'producto'          => $producto,
            'stock_por_almacen' => $stockPorAlmacen,
        ]);
    }

    // POST /api/productos
    public function store(ProductoRequest $request)
    {
        $producto = Producto::create($request->validated());
        $producto->load(['categoria', 'proveedor']);

        return response()->json($producto, 201);
    }

    // GET /api/productos/{id}
    public function show($id)
    {
        $producto = Producto::with(['categoria', 'proveedor'])->findOrFail($id);

        $stockPorAlmacen = Inventario::with('almacen')
            ->where('id_producto', $id)
            ->get()
            ->map(fn($inv) => [
                'almacen'  => $inv->almacen->nombre ?? 'Sin almacén',
                'cantidad' => $inv->cantidad,
            ]);

        return response()->json([
            'producto'         => $producto,
            'stock_por_almacen'=> $stockPorAlmacen,
        ]);
    }

    // PUT /api/productos/{id}
    public function update(ProductoRequest $request, $id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update($request->validated());
        $producto->load(['categoria', 'proveedor']);

        return response()->json($producto);
    }

    // DELETE /api/productos/{id}  → soft-delete (activo = 0)
    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->update(['activo' => 0]);

        return response()->json(['message' => 'Producto desactivado correctamente']);
    }
}

