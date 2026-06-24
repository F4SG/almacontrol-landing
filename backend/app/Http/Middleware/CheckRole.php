<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Verifica que el usuario autenticado tenga alguno de los roles permitidos.
     *
     * Uso en rutas: ->middleware('role:Administrador')
     *               ->middleware('role:Administrador,Encargado')
     *
     * @param  string  $roles  Roles permitidos separados por coma
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $usuario = $request->user();

        // Cargamos la relación rol si aún no está cargada
        if (! $usuario->relationLoaded('rol')) {
            $usuario->load('rol');
        }

        $nombreRol = $usuario->rol?->nombre;

        if (! $nombreRol || ! in_array($nombreRol, $roles, true)) {
            $rolesTexto = implode(' o ', $roles);

            return response()->json([
                'message' => "No tienes permisos para realizar esta acción. Se requiere rol: {$rolesTexto}.",
            ], 403);
        }

        return $next($request);
    }
}
