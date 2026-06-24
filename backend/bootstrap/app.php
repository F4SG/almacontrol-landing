<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // CORS — aplica a todas las rutas web y api
        $middleware->prepend(\Illuminate\Http\Middleware\HandleCors::class);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (\Throwable $e, Request $request) {
            if ($request->expectsJson()) {
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'message' => 'Error de validación',
                        'errors'  => $e->errors(),
                    ], 422);
                }
                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    return response()->json(['message' => 'No autenticado'], 401);
                }
                if ($e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException) {
                    return response()->json(['message' => 'Recurso no encontrado'], 404);
                }
                return response()->json([
                    'message' => 'Error interno del servidor',
                    'error'   => config('app.debug') ? ($e->getMessage() ?: get_class($e)) . ' in ' . $e->getFile() . ':' . $e->getLine() : null,
                    'trace'   => config('app.debug') ? $e->getTraceAsString() : null,
                ], 500);
            }
        });
    })->create();
