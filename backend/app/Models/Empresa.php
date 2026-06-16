<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table      = 'empresa';
    protected $primaryKey = 'id_empresa';
    public    $timestamps = false;

    protected $fillable = [
        'razon_social', 'nit', 'direccion', 'telefono', 'correo', 'logo_url',
    ];

    public function almacenes()
    {
        return $this->hasMany(Almacen::class, 'id_empresa', 'id_empresa');
    }

    public function proveedores()
    {
        return $this->hasMany(Proveedor::class, 'id_empresa', 'id_empresa');
    }
}
