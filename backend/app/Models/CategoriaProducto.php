<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Traits\BelongsToEmpresa;

class CategoriaProducto extends Model
{
    use BelongsToEmpresa;

    protected $table      = 'categoria_producto';
    protected $primaryKey = 'id_categoria';
    public    $timestamps = false;

    protected $fillable = ['nombre', 'descripcion'];

    public function productos()
    {
        return $this->hasMany(Producto::class, 'id_categoria', 'id_categoria');
    }
}

