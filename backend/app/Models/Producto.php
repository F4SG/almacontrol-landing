<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table      = 'producto';
    protected $primaryKey = 'id_producto';
    public    $timestamps = false;

    protected $fillable = [
        'id_categoria', 'id_proveedor', 'nombre', 'descripcion',
        'codigo_barras', 'codigo_qr', 'codigo_interno', 'unidad_medida',
        'precio_costo', 'precio_venta', 'stock_minimo', 'activo',
    ];

    protected $casts = [
        'activo'        => 'boolean',
        'precio_costo'  => 'decimal:2',
        'precio_venta'  => 'decimal:2',
        'stock_minimo'  => 'integer',
    ];

    public function categoria()
    {
        return $this->belongsTo(CategoriaProducto::class, 'id_categoria', 'id_categoria');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor', 'id_proveedor');
    }

    public function inventarios()
    {
        return $this->hasMany(Inventario::class, 'id_producto', 'id_producto');
    }

    public function alertas()
    {
        return $this->hasMany(Alerta::class, 'id_producto', 'id_producto');
    }
}
