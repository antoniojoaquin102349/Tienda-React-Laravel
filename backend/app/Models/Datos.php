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
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pedidos()
    {
        return $this->hasMany(Pedido::class, 'user_id', 'user_id');
    }

}