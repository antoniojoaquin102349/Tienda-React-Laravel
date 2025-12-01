<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nombre',
        'email',
        'telefono',
        'direccion',
        'ciudad',
        'cp',
        'envio',
        'pago',
        'notas',
        'total',
        'estado',
    ];

    public function productos()
    {
        return $this->hasMany(PedidoProducto::class);
    }
}

