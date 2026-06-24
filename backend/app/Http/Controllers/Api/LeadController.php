<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Mail\LeadNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class LeadController extends Controller
{
    /**
     * Display a listing of the pending leads.
     */
    public function index()
    {
        // Traer leads que no tengan un usuario ya creado con su correo
        $correosUsuarios = \App\Models\Usuario::pluck('correo');
        $leads = Lead::whereNotIn('correo', $correosUsuarios)->orderBy('created_at', 'desc')->get();
        return response()->json($leads);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre'         => 'required|string|max:100',
            'correo'         => 'required|email|max:150',
            'empresa'        => 'required|string|max:150',
            'tamano_empresa' => 'required|string|max:50',
        ]);

        // Guardar el lead en la base de datos
        $lead = Lead::create([
            'nombre'         => $request->nombre,
            'correo'         => $request->correo,
            'empresa'        => $request->empresa,
            'tamano_empresa' => $request->tamano_empresa,
        ]);

        // Enviar notificación al administrador. 
        // Usamos env('MAIL_FROM_ADDRESS') o un correo por defecto si no está configurado.
        $adminEmail = env('MAIL_ADMIN_ADDRESS', env('MAIL_FROM_ADDRESS', 'admin@almacontrol.shop'));
        
        try {
            Mail::to($adminEmail)->send(new LeadNotification($lead));
        } catch (\Exception $e) {
            // Log the error but don't fail the request so the user still sees success
            \Log::error('Error sending lead notification email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Lead registrado correctamente.',
            'lead'    => $lead
        ], 201);
    }

    /**
     * Approves a lead: creates an Admin user and sends credentials via email.
     */
    public function approve($id)
    {
        $lead = Lead::findOrFail($id);

        // Verificar si ya existe un usuario con este correo
        $existingUser = \App\Models\Usuario::where('correo', $lead->correo)->first();
        if ($existingUser) {
            return response()->json(['message' => 'El usuario ya existe.'], 400);
        }

        // Crear la Empresa a partir del Lead
        $empresa = \App\Models\Empresa::create([
            'razon_social' => $lead->empresa,
            'nit'          => '0',
            'direccion'    => null,
            'telefono'     => null,
            'correo'       => null,
        ]);

        // Generar contraseña aleatoria de 8 caracteres
        $passwordPlain = \Illuminate\Support\Str::random(8);

        // Crear el usuario con rol de Admin (id_rol = 1) y asignarlo a la empresa
        $usuario = \App\Models\Usuario::create([
            'id_rol'         => 1, // Admin
            'id_empresa'     => $empresa->id_empresa,
            'nombre'         => $lead->nombre,
            'apellido'       => '',
            'correo'         => $lead->correo,
            'contrasena'     => \Illuminate\Support\Facades\Hash::make($passwordPlain),
            'telefono'       => null,
            'activo'         => true,
            'primer_acceso'  => true,
            'fecha_creacion' => now(),
        ]);

        // Enviar email con las credenciales
        try {
            Mail::to($usuario->correo)->send(new \App\Mail\WelcomeCredentials($usuario, $passwordPlain));
        } catch (\Exception $e) {
            \Log::error('Error sending welcome credentials: ' . $e->getMessage());
            return response()->json(['message' => 'Usuario creado, pero hubo un error enviando el correo.'], 500);
        }

        return response()->json([
            'message' => 'Cliente aprobado exitosamente. Se le ha enviado un correo con sus credenciales.',
            'usuario' => $usuario
        ]);
    }
}
