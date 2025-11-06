<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Producto;

Route::get('/productos', function () {
    // Devuelve todos los productos
    return response()->json(Producto::all());
});

Route::post('/productos', function (Request $request) {
    // Validar los datos recibidos
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'precio' => 'required|numeric',
        'descripcion' => 'nullable|string',
        'stock' => 'required|integer',
        'categoria' => 'nullable|string|max:255',
        'imagen' => 'nullable|string|max:255',
    ]);

    // Crear el producto
    $producto = Producto::create($validated);
    return response()->json($producto, 201);    
});