<?php

namespace App\Http\Controllers;

use App\Models\Pedido;
use App\Models\PedidoProducto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PedidoController extends Controller
{
    public function store(Request $request)
    {
        $carrito = $request->input('carrito'); // viene del frontend
        if (empty($carrito)) {
            return response()->json(['message' => 'Carrito vacío'], 400']);
        }

        $total = array_sum(array_map(fn($item) => $item['precio'] * $item['cantidad'], $carrito));

        $pedido = Pedido::create([
            'user_id' => Auth::id(),
            'total' => $total,
            'estado' => 'completado',
        ]);

        foreach ($carrito as $item) {
            PedidoProducto::create([
                'pedido_id' => $pedido->id,
                'producto_id' => $item['id'],
                'nombre' => $item['nombre'],
                'precio' => $item['precio'],
                'cantidad' => $item['cantidad'],
                'imagen' => $item['imagen'] ?? null,
            ]);
        }

        return response()->json([
            'message' => '¡Pedido realizado con éxito!',
            'pedido' => $pedido->load('productos')
        ]);
    }

    public function historial()
    {
        $pedidos = Auth::user()->pedidos()->with('productos')->latest()->get();

        return response()->json($pedidos);
    }
}
        