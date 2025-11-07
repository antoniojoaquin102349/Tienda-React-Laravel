<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';

    protected $fillable = [
        'cliente_id', 'direccion_id', 'numero_pedido', 'subtotal',
        'impuestos', 'envio', 'total', 'estado', 'notas', 'fecha_envio'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'impuestos' => 'decimal:2',
        'envio' => 'decimal:2',
        'total' => 'decimal:2',
        'fecha_envio' => 'datetime',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function direccion()
    {
        return $this->belongsTo(Direccion::class);
    }

    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'pedido_productos')
                    ->withPivot('nombre_producto', 'cantidad', 'precio_unitario', 'precio_oferta', 'subtotal')
                    ->withTimestamps();
    }

    public function pago()
    {
        return $this->hasOne(Pago::class);
    }

    // Generar número de pedido
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($pedido) {
            if (empty($pedido->numero_pedido)) {
                $ultimo = self::max('id') ?? 0;
                $pedido->numero_pedido = 'PED-' . date('Y') . '-' . str_pad($ultimo + 1, 6, '0', STR_PAD_LEFT);
            }
        });
    }
}