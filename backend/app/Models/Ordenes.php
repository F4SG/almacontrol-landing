<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToEmpresa;

class Ordenes extends Model
{
    use BelongsToEmpresa;

    protected $table      = 'ordenes';
    protected $primaryKey = 'id_orden';
    public    $timestamps = false;

    protected $fillable = [
        'id_tipo_orden', 'id_almacen_origen', 'id_almacen_destino', 'id_usuario',
        'numero_documento', 'numero_factura_sin', 'estado',
        'observaciones', 'fecha_orden', 'fecha_procesada',
    ];

    protected $casts = [
        'fecha_orden'    => 'datetime',
        'fecha_procesada'=> 'datetime',
    ];

    public function tipoOrden()
    {
        return $this->belongsTo(TipoOrden::class, 'id_tipo_orden', 'id_tipo_orden');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function almacenOrigen()
    {
        return $this->belongsTo(Almacen::class, 'id_almacen_origen', 'id_almacen');
    }

    public function almacenDestino()
    {
        return $this->belongsTo(Almacen::class, 'id_almacen_destino', 'id_almacen');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleOrden::class, 'id_orden', 'id_orden');
    }
}

