<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CategoriaProducto;

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json(CategoriaProducto::orderBy('nombre')->get());
    }
}
