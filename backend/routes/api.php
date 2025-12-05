<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\CarritoController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// =========================
// AUTH (Públicas - sin autenticación)
// =========================
Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('login', [AuthController::class, 'login'])->name('login');

    // Google OAuth
    Route::get('google', [AuthController::class, 'redirectToGoogle'])->name('google');
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// =========================
// PEDIDOS (Usuarios e invitados)
// =========================
// Ruta unificada para usuarios logueados e invitados
Route::post('/guardar-pedido', [PedidoController::class, 'store']);
Route::post('/check-email', [PedidoController::class, 'checkEmail']);

// =========================
// RUTAS PROTEGIDAS CON JWT
// =========================
Route::middleware('jwt.auth')->group(function () {

    // Perfil del usuario autenticado
    Route::get('/me', [AuthController::class, 'me']);

    // Refresh token
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Usuarios (solo admin o según tu lógica)
    Route::get('users', [UserController::class, 'index']);

    // HISTORIAL DE PEDIDOS
    Route::get('/mis-pedidos', [PedidoController::class, 'misPedidos']);

    // DATOS DEL USUARIO
    Route::get('/usuarios/datos', [AuthController::class, 'obtenerDatosUsuario']);

    // ACTUALIZAR DATOS DEL USUARIO
    Route::put('/usuarios/datos', [AuthController::class, 'actualizarDatosUsuario']);



     /*
    |------------------------------------------------
    | Gestión del Carrito de Compras
    |------------------------------------------------
    | Rutas para administrar los productos en el carrito
    | del usuario autenticado.
    */
    Route::prefix('carrito')->group(function () {
        Route::get('/', [CarritoController::class, 'index']);                               // ver carrito
        Route::post('/', [CarritoController::class, 'store']);                              // agregar producto
        Route::put('/{producto}', [CarritoController::class, 'update']);                    // actualizar cantidad
        Route::delete('/producto/{producto}', [CarritoController::class, 'destroy']);       // eliminar producto
        Route::delete('/vaciar', [CarritoController::class, 'vaciar']);                     // vaciar carrito
        Route::post('/sync', [CarritoController::class, 'sync']);                           // sincronizar carrito invitado
    });
});

// =========================
// PRODUCTOS (Públicas)
// =========================
Route::prefix('productos')->name('productos.')->group(function () {

    // Más vendidos
    Route::get('mas-vendidos', [ProductoController::class, 'masVendidos'])->name('mas-vendidos');

    // Búsqueda avanzada
    Route::get('buscar', function (Request $request) {
        $q   = $request->input('q');
        $cat = $request->input('cat');

        $query = \App\Models\Producto::query();

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('nombre', 'LIKE', "%{$q}%")
                    ->orWhere('referencia', 'LIKE', "%{$q}%")
                    ->orWhere('categoria', 'LIKE', "%{$q}%");
            });
        }

        if ($cat) {
            $catNormalized = str_replace(
                ['á', 'é', 'í', 'ó', 'ú', 'Á', 'É', 'Í', 'Ó', 'Ú', 'ñ', 'Ñ'],
                ['a', 'e', 'i', 'o', 'u', 'A', 'E', 'I', 'O', 'U', 'n', 'N'],
                $cat
            );

            $query->whereRaw(
                "REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(LOWER(categoria),
                'á','a'),'é','e'),'í','i'),'ó','o'),'ú','u'),'ñ','n') LIKE ?",
                ["%" . strtolower($catNormalized) . "%"]
            );
        }

        return response()->json($query->get());
    })->name('buscar');
});
