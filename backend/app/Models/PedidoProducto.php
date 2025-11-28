<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoProducto extends Model
{
    protected $table = 'pedido_productos';
    protected $fillable = ['pedido_id', 'producto_id', 'nombre', 'precio', 'cantidad', 'imagen'];

    // Relación con el pedido
    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    // Relación con el producto original - ESTA ES LA RELACIÓN QUE FALTABA
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}