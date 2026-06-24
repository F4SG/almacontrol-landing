<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens;

    protected $table      = 'usuario';
    protected $primaryKey = 'id_usuario';
    public    $timestamps = false;

    protected $fillable = [
        'id_rol', 'id_empresa', 'nombre', 'apellido', 'correo',
        'contrasena', 'telefono', 'activo', 'fecha_creacion', 'primer_acceso',
    ];

    protected $hidden = ['contrasena'];

    protected $casts = [
        'activo'          => 'boolean',
        'primer_acceso'   => 'boolean',
        'fecha_creacion'  => 'datetime',
    ];

    /** Sanctum / Auth */
    public function getAuthPassword(): string
    {
        return $this->contrasena;
    }

    public function getAuthIdentifierName(): string
    {
        return 'correo';
    }

    // ── Relaciones ──────────────────────────────────────────────────────────

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'id_rol', 'id_rol');
    }
}
