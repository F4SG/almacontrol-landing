<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reporte extends Model
{
    protected $table      = 'reporte';
    protected $primaryKey = 'id_reporte';
    public    $timestamps = false;

    protected $fillable = [
        'id_usuario', 'id_almacen', 'tipo_reporte',
        'formato', 'parametros', 'url_archivo', 'fecha_generado',
    ];

    protected $casts = [
        'fecha_generado' => 'datetime',
        'parametros'     => 'array',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'id_almacen', 'id_almacen');
    }
}
