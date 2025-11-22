<?php

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Api\ProductoController;

Route::prefix('auth')->group(function(){
    Route::post('register',[AuthController::class, 'register']);
    Route::post('login',[AuthController::class, 'login']);

     // Google OAuth (sin JWT)
    Route::get('google', [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);
    
}); 

Route::middleware(['jwt.verify'])->group(function(){
    // Rutas protegidas
    Route::get('users', [UserController::class, 'index']); 
}); 

// 📈 Endpoint para obtener los productos más vendidos
Route::get('/productos/buscar', [ProductoController::class, 'buscar']);
Route::get('/productos/mas-vendidos', [ProductoController::class, 'masVendidos']);


// 🔎 Endpoint para buscar productos
Route::get('/productos/buscar', function(Request $request) {
    $q = $request->input('q');   // término de búsqueda
    $cat = $request->input('cat'); // categoría seleccionada

    $query = Producto::query();

    // Filtrar por texto: nombre, referencia o categoría
    if ($q) {
        $query->where(function($sub) use ($q) {
            $sub->where('nombre', 'LIKE', "%{$q}%")
                ->orWhere('referencia', 'LIKE', "%{$q}%")
                ->orWhere('categoria', 'LIKE', "%{$q}%");
        });
    }

    // Filtrar por categoría, normalizando acentos (MySQL)
    if ($cat) {
        $catNormalized = str_replace(
            ['á','é','í','ó','ú','Á','É','Í','Ó','Ú'],
            ['a','e','i','o','u','A','E','I','O','U'],
            $cat
        );

        $query->whereRaw("
            REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(categoria),
            'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u') LIKE ?
        ", ["%". strtolower($catNormalized) ."%"]);
    }

    $productos = $query->get();

    return response()->json($productos);
});
