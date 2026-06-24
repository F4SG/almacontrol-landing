<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleOrden extends Model
{
    protected $table      = 'detalle_orden';
    protected $primaryKey = 'id_detalle';
    public    $timestamps = false;

    protected $fillable = [
        'id_orden', 'id_producto', 'id_lote', 'cantidad', 'precio_unitario',
    ];

    protected $casts = [
        'cantidad'       => 'integer',
        'precio_unitario'=> 'decimal:2',
    ];

    public function orden()
    {
        return $this->belongsTo(Ordenes::class, 'id_orden', 'id_orden');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    public function lote()
    {
        return $this->belongsTo(Lote::class, 'id_lote', 'id_lote');
    }
}
