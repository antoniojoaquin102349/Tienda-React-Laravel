<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Producto;
use Carbon\Carbon;

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
    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_productos')
                    ->withPivot(['cantidad', 'precio'])
                    ->withTimestamps();
    }
     public function envio()
    {
        return $this->hasOne(\App\Models\Envio::class, 'pedido_id');
    }
}


