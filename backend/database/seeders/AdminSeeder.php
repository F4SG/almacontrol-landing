<?php

namespace Database\Seeders;

use App\Models\Usuario;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        // Evitar duplicados
        if (Usuario::where('correo', 'admin@almacontrol.bo')->exists()) {
            $this->command->info('Admin ya existe, saltando seeder.');
            return;
        }

        Usuario::create([
            'id_rol'         => 1, // Administrador
            'nombre'         => 'Admin',
            'apellido'       => 'AlmaControl',
            'correo'         => 'admin@almacontrol.bo',
            'contrasena'     => bcrypt('Admin123!'),
            'telefono'       => null,
            'activo'         => 1,
            'fecha_creacion' => now(),
        ]);

        $this->command->info('Admin creado: admin@almacontrol.bo / Admin123!');
    }
}
