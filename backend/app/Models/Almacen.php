<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToEmpresa;

class Almacen extends Model
{
    use BelongsToEmpresa;

    protected $table      = 'almacen';
    protected $primaryKey = 'id_almacen';
    public    $timestamps = false;

    protected $fillable = [
        'id_empresa', 'nombre', 'direccion', 'responsable', 'activo',
    ];

    protected $casts = ['activo' => 'boolean'];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }

    public function ubicaciones()
    {
        return $this->hasMany(Ubicacion::class, 'id_almacen', 'id_almacen');
    }

    public function inventarios()
    {
        return $this->hasMany(Inventario::class, 'id_almacen', 'id_almacen');
    }
}

