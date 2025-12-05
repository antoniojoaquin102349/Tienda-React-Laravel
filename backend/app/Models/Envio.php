<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Envio extends Model
{
    protected $table = 'envios';

    protected $fillable = [
    'pedido_id',
    'referencia',
    'nombre_producto',
    'cantidad',
    'nombre_cliente',
    'telefono',
    'direccion',
    'ciudad',
    'codigo_postal',
    'estado',
    'transportista',
    'numero_seguimiento',
    'enviado_at',
    'entregado_at',
    'precio_unitario',
];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

}