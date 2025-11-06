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
        'direccion',
        'password'
    ];
}
