<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToEmpresa;

class Lote extends Model
{
    use BelongsToEmpresa;

    protected $table      = 'lote';
    protected $primaryKey = 'id_lote';
    public    $timestamps = false;

    protected $fillable = [
        'id_producto', 'id_almacen', 'numero_lote',
        'fecha_fabricacion', 'fecha_vencimiento',
        'cantidad_inicial', 'cantidad_actual',
    ];

    protected $casts = [
        'fecha_fabricacion' => 'date',
        'fecha_vencimiento' => 'date',
        'cantidad_inicial'  => 'integer',
        'cantidad_actual'   => 'integer',
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

