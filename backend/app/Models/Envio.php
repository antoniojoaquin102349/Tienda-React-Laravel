<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

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

    protected static function booted()
    {
        static::updating(function ($envio) {
            // Actualizar timestamps automáticos
            if ($envio->isDirty('estado')) {
                if ($envio->estado === 'enviado' && !$envio->enviado_at) {
                    $envio->enviado_at = Carbon::now();
                }
                if ($envio->estado === 'entregado' && !$envio->entregado_at) {
                    $envio->entregado_at = Carbon::now();
                }

                // Sincronizar estado con el pedido
                if ($envio->pedido) {
                    $pedido = $envio->pedido;

                    // Si quieres marcar el pedido como "entregado" solo si todos los envíos lo están:
                    if ($envio->estado === 'entregado') {
                        $todosEntregados = $pedido->envios()->where('estado', '!=', 'entregado')->count() === 0;
                        $pedido->estado = $todosEntregados ? 'entregado' : $envio->estado;
                    } else {
                        $pedido->estado = $envio->estado;
                    }

                    $pedido->save();
                }
            }
        });
    }

    public function pedido()
    {
        return $this->belongsTo(Pedido::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}