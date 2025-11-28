<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = ['user_id', 'total', 'estado'];

    protected $casts = [
        'total' => 'float', 
    ];

    public function productos()
    {
        return $this->hasMany(PedidoProducto::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
