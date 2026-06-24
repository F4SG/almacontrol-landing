<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FacturaSin extends Model
{
    protected $table      = 'factura_sin';
    protected $primaryKey = 'id_factura';
    public    $timestamps = false;

    protected $fillable = [
        'id_orden', 'numero_factura', 'cuf', 'nit_cliente', 'razon_social_cliente',
        'monto_total', 'estado_siat', 'fecha_emision', 'fecha_envio_siat', 'respuesta_siat',
    ];

    protected $casts = [
        'monto_total'     => 'decimal:2',
        'fecha_emision'   => 'datetime',
        'fecha_envio_siat'=> 'datetime',
    ];

    public function orden()
    {
        return $this->belongsTo(Ordenes::class, 'id_orden', 'id_orden');
    }
}
