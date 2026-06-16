<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ── POST /api/auth/register ─────────────────────────────────────────────
    public function register(Request $request)
    {
        $request->validate([
            'nombre'    => 'required|string|max:100',
            'apellido'  => 'required|string|max:100',
            'correo'    => 'required|email|max:150',
            'contrasena'=> 'required|string|min:6',
            'telefono'  => 'nullable|string|max:20',
        ]);

        if (Usuario::where('correo', $request->correo)->exists()) {
            return response()->json(['message' => 'El correo ya está registrado'], 422);
        }

        $usuario = Usuario::create([
            'id_rol'         => 2, // Encargado por defecto
            'nombre'         => $request->nombre,
            'apellido'       => $request->apellido,
            'correo'         => $request->correo,
            'contrasena'     => bcrypt($request->contrasena),
            'telefono'       => $request->telefono,
            'activo'         => 1,
            'fecha_creacion' => now(),
        ]);

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
        ], 201);
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
