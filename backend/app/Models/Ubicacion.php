<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ubicacion extends Model
{
    protected $table      = 'ubicacion';
    protected $primaryKey = 'id_ubicacion';
    public    $timestamps = false;

    protected $fillable = [
        'id_almacen', 'pasillo', 'estante', 'nivel', 'capacidad_max',
    ];

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'id_almacen', 'id_almacen');
    }
}
