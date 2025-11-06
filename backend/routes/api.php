<?php

use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
    return [
        ['id' => 1, 'name' => 'Juan'],
        ['id' => 2, 'name' => 'María'],
    ];
});
