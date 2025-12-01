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



        $productos = $query->get([
            'id', 'nombre', 'referencia', 'precio', 'imagen', 'descripcion'
        ]);

        return response()->json($productos);
    }

    // NUEVA RUTA: los 4 más vendidos
    public function masVendidos(Request $request)
    {
        $limit = $request->integer('limit', 4);

        $productos = Producto::select('id', 'nombre', 'referencia', 'precio', 'imagen', 'stock', 'descripcion')
            ->orderBy('vendido', 'desc') // los más vendidos primero
            ->limit($limit)
            ->get();

        return response()->json($productos);
    }
}