<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    // Campos que se pueden insertar o actualizar masivamente
    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'password',
        'pedidos', // 👈 añade este campo porque también existe en la tabla
    ];
}
