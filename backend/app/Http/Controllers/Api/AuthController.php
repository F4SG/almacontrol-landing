<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ── POST /api/auth/register ─────────────────────────────────────────────
    // El registro directo está deshabilitado.
    // Los nuevos clientes deben solicitar acceso desde la landing page.
    // Los usuarios internos los crea el Admin de cada empresa desde "Personal".
    public function register(Request $request)
    {
        return response()->json([
            'message' => 'El registro directo no está disponible. Solicita acceso desde almacontrol.shop o contacta al administrador de tu empresa.',
        ], 403);
    }


    // ── POST /api/auth/login ────────────────────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'correo'    => 'required|email',
            'contrasena'=> 'required|string',
        ]);

        $usuario = Usuario::with('rol')
            ->where('correo', $request->correo)
            ->where('activo', 1)
            ->first();

        if (! $usuario || ! Hash::check($request->contrasena, $usuario->contrasena)) {
            return response()->json(['message' => 'Credenciales incorrectas'], 401);
        }

        // Si es su primer acceso, cambiar la contraseña a "password" y marcar primer_acceso como falso
        if ($usuario->primer_acceso) {
            $usuario->update([
                'contrasena'    => bcrypt('password'),
                'primer_acceso' => false,
            ]);
            // Actualizar la instancia en memoria también para no tener discrepancias
            $usuario->contrasena = bcrypt('password');
            $usuario->primer_acceso = false;
        }

        // Eliminar tokens anteriores
        $usuario->tokens()->delete();

        $token = $usuario->createToken('almacontrol-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id_usuario' => $usuario->id_usuario,
                'nombre'     => $usuario->nombre,
                'apellido'   => $usuario->apellido,
                'correo'     => $usuario->correo,
                'rol'        => $usuario->rol,
            ],
        ]);
    }

    // ── POST /api/auth/logout ───────────────────────────────────────────────
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    // ── GET /api/auth/me ────────────────────────────────────────────────────
    public function me(Request $request)
    {
        $usuario = $request->user()->load('rol');

        return response()->json([
            'id_usuario' => $usuario->id_usuario,
            'nombre'     => $usuario->nombre,
            'apellido'   => $usuario->apellido,
            'correo'     => $usuario->correo,
            'telefono'   => $usuario->telefono,
            'rol'        => $usuario->rol,
        ]);
    }
}
