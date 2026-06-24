<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToEmpresa;

class Proveedor extends Model
{
    use BelongsToEmpresa;

    protected $table      = 'proveedor';
    protected $primaryKey = 'id_proveedor';
    public    $timestamps = false;

    protected $fillable = [
        'id_empresa', 'nombre', 'nit', 'contacto',
        'telefono', 'correo', 'direccion', 'activo',
    ];

    protected $casts = ['activo' => 'boolean'];

    public function empresa()
    {
        return $this->belongsTo(Empresa::class, 'id_empresa', 'id_empresa');
    }

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id_proveedor', 'id_proveedor');
    }
}

