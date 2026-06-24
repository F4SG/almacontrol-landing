<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleConteo extends Model
{
    protected $table      = 'detalle_conteo';
    protected $primaryKey = 'id_detalle_conteo';
    public    $timestamps = false;

    protected $fillable = [
        'id_conteo', 'id_producto', 'id_ubicacion',
        'cantidad_sistema', 'cantidad_contada', 'ajustado',
    ];

    protected $casts = [
        'cantidad_sistema'  => 'integer',
        'cantidad_contada'  => 'integer',
        'ajustado'          => 'boolean',
    ];

    public function conteo()
    {
        return $this->belongsTo(ConteoInventario::class, 'id_conteo', 'id_conteo');
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }
}
