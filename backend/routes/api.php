<?php

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Obtener todos los productos
Route::get('/productos', function () {
    return Producto::all();
});

