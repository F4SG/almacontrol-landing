<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToEmpresa;

class ConteoInventario extends Model
{
    use BelongsToEmpresa;

    protected $table      = 'conteo_inventario';
    protected $primaryKey = 'id_conteo';
    public    $timestamps = false;

    protected $fillable = [
        'id_almacen', 'id_usuario', 'nombre', 'estado',
        'fecha_inicio', 'fecha_fin', 'observaciones',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin'    => 'datetime',
    ];

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'id_almacen', 'id_almacen');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleConteo::class, 'id_conteo', 'id_conteo');
    }
}

