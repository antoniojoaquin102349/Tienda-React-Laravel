<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Producto;
use Illuminate\Http\Request;

class ProductoController extends Controller
{
    // Esta es la que ya usas en ListaProductos.tsx
    public function buscar(Request $request)
    {
        $q = $request->get('q', '');
        $cat = $request->get('cat', '');

        $query = Producto::query();

        if ($q) {
            $query->where(function ($qry) use ($q) {
                $qry->where('nombre', 'like', "%{$q}%")
                    ->orWhere('referencia', 'like', "%{$q}%");
            });
        }

        // Si en el futuro añades categorías más adelante, descomenta esto
        // if ($cat) {
        //     $query->where('categoria_id', $cat);
        // }

        $productos = $query->get([
            'id', 'nombre', 'referencia', 'precio', 'imagen', 'descripcion'
        ]);

        return response()->json($productos);
    }

    // NUEVA RUTA: los 4 más vendidos
    public function masVendidos(Request $request)
    {
        $limit = $request->integer('limit', 4);

        // Opción más realista cuando tengas pedidos existan (si tienes tabla pedidos y detalles_pedidos)
        // $productos = Producto::withCount('detallesPedidos as veces_vendido')
        //     ->orderByDesc('veces_vendido')
        //     ->limit($limit)
        //     ->get(['id', 'nombre', 'referencia', 'precio', 'imagen']);

        // MIENTRAS NO TENGAS VENTAS REALES → usamos un truco limpio:
        // Ordenamos por ID descendente (los últimos añadidos suelen ser los más populares al principio)
        // O si prefieres aleatorio para que cambie cada vez: ->inRandomOrder()

        $productos = Producto::select('id', 'nombre', 'referencia', 'precio', 'imagen')
            ->latest()           // los más nuevos primero
            // ->inRandomOrder() // o esto para que sea "aleatorio" y parezca más vivo
            ->limit($limit)
            ->get();

        return response()->json($productos);
    }
}