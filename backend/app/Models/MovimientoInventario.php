<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MovimientoInventario extends Model
{
    protected $table      = 'movimiento_inventario';
    protected $primaryKey = 'id_movimiento';
    public    $timestamps = false;

    protected $fillable = [
        'id_producto', 'id_almacen', 'id_lote', 'id_orden', 'id_usuario',
        'tipo_movimiento', 'cantidad', 'stock_antes', 'stock_despues',
        'observaciones', 'fecha', 'sincronizado',
    ];

    protected $casts = [
        'cantidad'     => 'integer',
        'stock_antes'  => 'integer',
        'stock_despues'=> 'integer',
        'fecha'        => 'datetime',
        'sincronizado' => 'boolean',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class, 'id_producto', 'id_producto');
    }

    public function almacen()
    {
        return $this->belongsTo(Almacen::class, 'id_almacen', 'id_almacen');
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class, 'id_usuario', 'id_usuario');
    }

    public function lote()
    {
        return $this->belongsTo(Lote::class, 'id_lote', 'id_lote');
    }
}
