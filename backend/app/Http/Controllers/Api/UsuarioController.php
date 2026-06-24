<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsuarioController extends Controller
{
    // ── Correo del super-admin de la plataforma (nunca visible ni modificable) ─
    const SUPERADMIN_EMAIL = 'admin@almacontrol.bo';

    // ── GET /api/usuarios ───────────────────────────────────────────────────
    public function index()
    {
        $usuarios = Usuario::with('rol')
            ->where('id_empresa', request()->user()->id_empresa)
            ->where('correo', '!=', self::SUPERADMIN_EMAIL)
            ->orderBy('fecha_creacion', 'desc')
            ->get()
            ->map(fn($u) => $this->format($u));

        return response()->json($usuarios);
    }

    // ── POST /api/usuarios ──────────────────────────────────────────────────
    public function store(Request $request)
    {
        $request->validate([
            'nombre'     => 'required|string|max:100',
            'apellido'   => 'required|string|max:100',
            'correo'     => 'required|email|max:150|unique:usuario,correo',
            'contrasena' => 'required|string|min:6',
            'telefono'   => 'nullable|string|max:20',
            'id_rol'     => 'required|integer|exists:rol,id_rol',
        ]);

        $usuario = Usuario::create([
            'id_rol'         => $request->id_rol,
            'id_empresa'     => request()->user()->id_empresa,
            'nombre'         => $request->nombre,
            'apellido'       => $request->apellido,
            'correo'         => $request->correo,
            'contrasena'     => bcrypt($request->contrasena),
            'telefono'       => $request->telefono,
            'activo'         => true,
            'fecha_creacion' => now(),
        ]);

        $usuario->load('rol');

        return response()->json($this->format($usuario), 201);
    }

    // ── GET /api/usuarios/{id} ──────────────────────────────────────────────
    public function show(string $id)
    {
        $usuario = Usuario::with('rol')
            ->where('id_empresa', request()->user()->id_empresa)
            ->findOrFail($id);

        return response()->json($this->format($usuario));
    }

    // ── PUT /api/usuarios/{id} ──────────────────────────────────────────────
    public function update(Request $request, string $id)
    {
        $usuario = Usuario::where('id_empresa', request()->user()->id_empresa)->findOrFail($id);

        $request->validate([
            'nombre'     => 'sometimes|string|max:100',
            'apellido'   => 'sometimes|string|max:100',
            'correo'     => 'sometimes|email|max:150|unique:usuario,correo,' . $usuario->id_usuario . ',id_usuario',
            'contrasena' => 'sometimes|string|min:6',
            'telefono'   => 'nullable|string|max:20',
            'id_rol'     => 'sometimes|integer|exists:rol,id_rol',
            'activo'     => 'sometimes|boolean',
        ]);

        $data = $request->only(['nombre', 'apellido', 'correo', 'telefono', 'id_rol', 'activo']);

        if ($request->filled('contrasena')) {
            $data['contrasena'] = bcrypt($request->contrasena);
        }

        $usuario->update($data);
        $usuario->load('rol');

        return response()->json($this->format($usuario));
    }

    // ── DELETE /api/usuarios/{id} ───────────────────────────────────────────
    // Desactivación lógica — nunca se borra un usuario de la BD
    public function destroy(string $id)
    {
        $usuario = Usuario::where('id_empresa', request()->user()->id_empresa)->findOrFail($id);

        // Proteger al super-admin de la plataforma: nunca se puede tocar
        if ($usuario->correo === self::SUPERADMIN_EMAIL) {
            return response()->json([
                'message' => 'Esta cuenta está protegida y no puede ser modificada.',
            ], 403);
        }

        // Un administrador de empresa no puede desactivarse a sí mismo
        if ((int) $id === request()->user()->id_usuario) {
            return response()->json([
                'message' => 'No puedes desactivar tu propia cuenta de administrador.',
            ], 422);
        }

        // No se puede desactivar a otro Administrador
        $usuario->loadMissing('rol');
        if ($usuario->rol?->nombre === 'Administrador') {
            return response()->json([
                'message' => 'No puedes desactivar la cuenta de otro Administrador.',
            ], 403);
        }

        $usuario->update(['activo' => false]);

        // Revocar todos los tokens activos del usuario desactivado
        $usuario->tokens()->delete();

        return response()->json(['message' => 'Usuario desactivado correctamente.']);
    }

    // ── GET /api/roles (helper para el frontend) ────────────────────────────
    // Nota: agrega esta ruta manualmente en api.php si la necesitas:
    // Route::get('roles', fn() => response()->json(Rol::all()));

    // ── Formato de respuesta ─────────────────────────────────────────────────
    private function format(Usuario $u): array
    {
        return [
            'id_usuario'     => $u->id_usuario,
            'nombre'         => $u->nombre,
            'apellido'       => $u->apellido,
            'correo'         => $u->correo,
            'telefono'       => $u->telefono,
            'activo'         => $u->activo,
            'fecha_creacion' => $u->fecha_creacion,
            'rol'            => $u->rol,
        ];
    }
}
