<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\AlmacenController;
use App\Http\Controllers\Api\ProveedorController;
use App\Http\Controllers\Api\InventarioController;
use App\Http\Controllers\Api\OrdenController;
use App\Http\Controllers\Api\AlertaController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\UbicacionController;
use App\Http\Controllers\Api\ReporteController;
use App\Http\Controllers\Api\UsuarioController;
use App\Http\Controllers\Api\LeadController;


// ── Auth (públicas) ──────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
    Route::post('logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me',        [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::post('leads', [LeadController::class, 'store']);
Route::get('leads', [LeadController::class, 'index']);
Route::get('leads/{id}/approve', [LeadController::class, 'approve']);

// ── Rutas protegidas (cualquier usuario autenticado) ─────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Dashboard — todos los roles pueden ver el resumen
    Route::get('dashboard', [DashboardController::class, 'index']);

    // Categorías — solo lectura, todos los roles
    Route::get('categorias-lista', [CategoriaController::class, 'index']);

    // ── Productos ────────────────────────────────────────────────────────────
    // Lectura: todos los roles
    Route::get('productos/buscar', [ProductoController::class, 'buscar']);
    Route::get('productos',        [ProductoController::class, 'index']);
    Route::get('productos/{producto}', [ProductoController::class, 'show']);

    // Escritura: solo Administrador y Encargado
    Route::post('productos',             [ProductoController::class, 'store'])
        ->middleware('role:Administrador,Encargado');
    Route::put('productos/{producto}',   [ProductoController::class, 'update'])
        ->middleware('role:Administrador,Encargado');
    Route::delete('productos/{producto}',[ProductoController::class, 'destroy'])
        ->middleware('role:Administrador,Encargado');

    // ── Almacenes — solo Administrador ──────────────────────────────────────
    Route::apiResource('almacenes', AlmacenController::class)
        ->middleware('role:Administrador');

    // ── Proveedores — solo Administrador ────────────────────────────────────
    Route::apiResource('proveedores', ProveedorController::class)
        ->middleware('role:Administrador');

    // ── Inventario ───────────────────────────────────────────────────────────
    // Lectura: todos los roles
    Route::get('inventario',  [InventarioController::class, 'index']);
    Route::get('movimientos', [InventarioController::class, 'movimientos']);

    // Escritura: Administrador y Encargado
    Route::post('inventario/entrada', [InventarioController::class, 'entrada'])
        ->middleware('role:Administrador,Encargado');
    Route::post('inventario/salida',  [InventarioController::class, 'salida'])
        ->middleware('role:Administrador,Encargado');

    // ── Órdenes ───────────────────────────────────────────────────────────────
    // Lectura: todos los roles
    Route::get('ordenes',      [OrdenController::class, 'index']);
    Route::get('ordenes/{id}', [OrdenController::class, 'show']);

    // Escritura: Administrador y Encargado
    Route::post('ordenes',                [OrdenController::class, 'store'])
        ->middleware('role:Administrador,Encargado');
    Route::put('ordenes/{id}/estado',     [OrdenController::class, 'cambiarEstado'])
        ->middleware('role:Administrador,Encargado');

    // ── Alertas — todos los roles pueden ver; leer las propias está OK ────────
    Route::get('alertas',              [AlertaController::class, 'index']);
    Route::put('alertas/leer-todas',   [AlertaController::class, 'leerTodas'])
        ->middleware('role:Administrador,Encargado');
    Route::put('alertas/{id}/leer',    [AlertaController::class, 'leer'])
        ->middleware('role:Administrador,Encargado');

    // ── Ubicaciones — Administrador y Encargado ───────────────────────────────
    Route::get('almacenes/{id}/ubicaciones',  [UbicacionController::class, 'index']);
    Route::post('almacenes/{id}/ubicaciones', [UbicacionController::class, 'store'])
        ->middleware('role:Administrador,Encargado');
    Route::get('almacenes/{id}/mapa',         [UbicacionController::class, 'mapa']);
    Route::delete('ubicaciones/{id}',         [UbicacionController::class, 'destroy'])
        ->middleware('role:Administrador,Encargado');

    // ── Reportes — Administrador y Encargado ─────────────────────────────────
    Route::get('reportes/inventario-csv',  [ReporteController::class, 'inventarioCsv'])
        ->middleware('role:Administrador,Encargado');
    Route::get('reportes/movimientos-csv', [ReporteController::class, 'movimientosCsv'])
        ->middleware('role:Administrador,Encargado');

    // ── Gestión de Usuarios — solo Administrador ──────────────────────────────
    Route::apiResource('usuarios', UsuarioController::class)
        ->middleware('role:Administrador');
});
