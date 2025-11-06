<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos'; // explícito (aunque Laravel lo detecta)

    protected $fillable = [
        'cliente_id',
        'numero_pedido',
        'subtotal',
        'impuestos',
        'descuento',
        'total',
        'metodo_pago',
        'estado',
        'fecha_pedido',
        'fecha_envio',
        'fecha_entrega',
        'direccion_envio',
        'notas'
    ];

    protected $casts = [
        'direccion_envio' => 'array',
        'fecha_pedido' => 'date',
        'fecha_envio' => 'date',
        'fecha_entrega' => 'date',
    ];

    // Relaciones
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function items()
    {
        return $this->hasMany(PedidoItem::class);
    }
}