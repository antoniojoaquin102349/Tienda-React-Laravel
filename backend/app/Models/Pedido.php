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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function datos()
    {
        return $this->hasOne(Datos::class, 'user_id', 'user_id');
    }

    public function pedidoProductos()
    {
        return $this->hasMany(PedidoProducto::class);
    }
}


