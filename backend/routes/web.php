<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        ['id' => 1, 'name' => 'Juan'],
        ['id' => 2, 'name' => 'María'],
    ]);
});
