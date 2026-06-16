<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    protected $table      = 'inventario';
    protected $primaryKey = 'id_inventario';
    public    $timestamps = false;

    protected $fillable = [
        'id_producto', 'id_almacen', 'id_ubicacion', 'cantidad', 'ultima_actualizacion',
    ];

    protected $casts = [
        'cantidad'            => 'integer',
        'ultima_actualizacion'=> 'datetime',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'id_almacen', 'id_almacen');
    }

    public function ubicacion()
    {
        return $this->belongsTo(Ubicacion::class, 'id_ubicacion', 'id_ubicacion');
    }
}
