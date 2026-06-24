<?php

namespace App\Models\Traits;

use App\Models\Scopes\EmpresaScope;
use Illuminate\Support\Facades\Auth;

trait BelongsToEmpresa
{
    protected static function booted()
    {
        static::addGlobalScope(new EmpresaScope);

        static::creating(function ($model) {
            if (Auth::check() && empty($model->id_empresa)) {
                $user = Auth::user();
                if ($user->id_empresa) {
                    $model->id_empresa = $user->id_empresa;
                }
            }
        });
    }
}
