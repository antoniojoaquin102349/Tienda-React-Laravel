<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    // ✅ Campos que se pueden insertar (mass assignment)
    protected $fillable = [
        'nombre',
        'email',
        'telefono',
        'password',
        
    ];
}
