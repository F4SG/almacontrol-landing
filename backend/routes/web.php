<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    $path = public_path('index.html');
    if (file_exists($path)) {
        return file_get_contents($path);
    }
    return response('React build no encontrado. Por favor haz npm run build.', 404);
})->where('any', '.*');
