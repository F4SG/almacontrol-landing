<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $id = $this->route('producto'); // id del producto en update

        return [
            'nombre'         => 'required|string|max:200',
            'id_categoria'   => 'required|integer|exists:categoria_producto,id_categoria',
            'id_proveedor'   => 'nullable|integer|exists:proveedor,id_proveedor',
            'descripcion'    => 'nullable|string',
            'unidad_medida'  => 'nullable|string|max:50',
            'precio_costo'   => 'nullable|numeric|min:0',
            'precio_venta'   => 'nullable|numeric|min:0',
            'stock_minimo'   => 'nullable|integer|min:0',
            'codigo_barras'  => 'nullable|string|unique:producto,codigo_barras,' . $id . ',id_producto',
            'codigo_interno' => 'nullable|string|unique:producto,codigo_interno,' . $id . ',id_producto',
            'codigo_qr'      => 'nullable|string',
            'activo'         => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required'       => 'El nombre del producto es requerido',
            'id_categoria.required' => 'La categoría es requerida',
            'id_categoria.exists'   => 'La categoría seleccionada no existe',
            'codigo_barras.unique'  => 'El código de barras ya está en uso',
            'codigo_interno.unique' => 'El código interno ya está en uso',
        ];
    }
}
