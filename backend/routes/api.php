<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\User\UserController;



Route::prefix('auth')->group(function(){
    Route::post('register',[AuthController::class, 'register']);
    Route::post('login',[AuthController::class, 'login']);

     // Google OAuth (sin JWT)
    Route::get('google', [AuthController::class, 'redirectToGoogle']);
    Route::get('google/callback', [AuthController::class, 'handleGoogleCallback']);
    
}); 

Route::middleware(['jwt.verify'])->group(function(){
    //van todas las rutas protegidas
    Route::get('users', [UserController::class, 'index']); 

}); 