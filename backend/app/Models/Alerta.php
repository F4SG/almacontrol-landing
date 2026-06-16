<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Alerta extends Model
{
    protected $table      = 'alerta';
    protected $primaryKey = 'id_alerta';
    public    $timestamps = false;

    protected $fillable = [
        'id_producto', 'id_almacen', 'tipo_alerta',
        'mensaje', 'leida', 'fecha_generada', 'fecha_leida',
    ];

    protected $casts = [
        'leida'          => 'boolean',
        'fecha_generada' => 'datetime',
        'fecha_leida'    => 'datetime',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'id_almacen', 'id_almacen');
    }
}
