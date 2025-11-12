<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Api\ProductController;

Route::get('auth/google', [GoogleController::class, 'redirectToGoogle']);
Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);
Route::get('/products', [ProductController::class, 'index']);
