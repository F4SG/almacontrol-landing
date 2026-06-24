<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToEmpresa;

class OrdenReposicion extends Model
{
    use BelongsToEmpresa;

    protected $table      = 'orden_reposicion';
    protected $primaryKey = 'id_reposicion';
    public    $timestamps = false;

    protected $fillable = [
        'id_producto', 'id_almacen', 'id_proveedor', 'cantidad_sugerida',
        'estado', 'fecha_creacion', 'fecha_actualizacion', 'observaciones',
    ];

    protected $casts = [
        'cantidad_sugerida' => 'integer',
        'fecha_creacion'    => 'datetime',
        'fecha_actualizacion'=> 'datetime',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'id_almacen', 'id_almacen');
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class, 'id_proveedor', 'id_proveedor');
    }
}

