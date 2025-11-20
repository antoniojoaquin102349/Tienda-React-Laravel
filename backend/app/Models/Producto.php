<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{ 
    protected $table = 'productos';

    protected $fillable = [
        'referencia',
        'nombre',
        'precio',
        'stock',
        'descripcion',
        'imagen',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($producto) {
            if (empty($producto->referencia)) {
                // Opción A: generar referencia automática (muy útil)
                $producto->referencia = 'REF-' . strtoupper(uniqid());

                // Opción B: o lanzar error claro
                // throw new \Exception('El campo referencia es obligatorio');
            }
        });
    }
}