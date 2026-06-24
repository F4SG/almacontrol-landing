<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$req = Illuminate\Http\Request::create('/api/productos/buscar', 'GET', ['codigo' => '7771609001448']);
$res = app(App\Http\Controllers\Api\ProductoController::class)->buscar($req);
echo $res->getContent();
