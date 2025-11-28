<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Datos extends Model
{
    protected $table = 'datos';

    protected $fillable = [
        'user_id',
        'telefono',
        'direccion',
        'ciudad',
        'codigo_postal',
        'numero_tarjeta',
        'nombre_tarjeta',
        'numero_seguridad',
        'fecha_vencimiento',
        'metodo_pago_guardado'
    ];

    protected $casts = [
        'metodo_pago_guardado' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}