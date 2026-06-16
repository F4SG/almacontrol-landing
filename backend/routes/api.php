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

// ── Auth (públicas) ──────────────────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login',    [AuthController::class, 'login']);
    Route::post('logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('me',        [AuthController::class, 'me'])->middleware('auth:sanctum');
});

// ── Rutas protegidas ─────────────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index']);

    // Categorías
    Route::get('categorias-lista', [CategoriaController::class, 'index']);

    // Productos
    Route::apiResource('productos', ProductoController::class);

    // Almacenes
    Route::apiResource('almacenes', AlmacenController::class);

    // Proveedores
    Route::apiResource('proveedores', ProveedorController::class);

    // Inventario
    Route::get('inventario',              [InventarioController::class, 'index']);
    Route::post('inventario/entrada',     [InventarioController::class, 'entrada']);
    Route::post('inventario/salida',      [InventarioController::class, 'salida']);
    Route::get('movimientos',             [InventarioController::class, 'movimientos']);

    // Órdenes
    Route::get('ordenes',                 [OrdenController::class, 'index']);
    Route::post('ordenes',                [OrdenController::class, 'store']);
    Route::get('ordenes/{id}',            [OrdenController::class, 'show']);
    Route::put('ordenes/{id}/estado',     [OrdenController::class, 'cambiarEstado']);

    // Alertas
    Route::get('alertas',                 [AlertaController::class, 'index']);
    Route::put('alertas/leer-todas',      [AlertaController::class, 'leerTodas']);
    Route::put('alertas/{id}/leer',       [AlertaController::class, 'leer']);
});
