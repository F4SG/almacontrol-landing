<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoOrden extends Model
{
    protected $table      = 'tipo_orden';
    protected $primaryKey = 'id_tipo_orden';
    public    $timestamps = false;

    protected $fillable = ['nombre'];
}
