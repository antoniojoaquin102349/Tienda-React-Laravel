<?php
// app/Http/Controllers/CarritoController.php
namespace App\Http\Controllers\Api;

use App\Models\Carrito;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class CarritoController extends Controller
{
    // Devuelve el carrito del usuario autenticado
    public function index(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        // Devuelve los items del carrito con la relación del producto
        $carrito = $user->carrito()
        ->join('productos', 'carritos.producto_id', '=', 'productos.id')
        ->select(
            'carritos.producto_id as id',
            'productos.nombre',
            'productos.referencia',
            'productos.precio',
            'productos.imagen',
            'carritos.cantidad'
        )
        ->get();

        return response()->json($carrito);
    }

    //Agregar producto
    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        // Validación de los datos que vienen del frontend
        $request->validate([
            'producto_id' => 'required|exists:productos,id',
            'cantidad'    => 'required|integer|min:1',
        ]);

        $productoId = $request->producto_id;
        $cantidad   = $request->cantidad;

        // Verifica si ya existe el producto en el carrito
        $item = $user->carrito()->where('producto_id', $productoId)->first();
        if ($item) {
            $item->cantidad += $cantidad;
            $item->save();
        } else {
            $user->carrito()->create([
                'producto_id' => $productoId,
                'cantidad'    => $cantidad,
            ]);
        }

        return response()->json(['message' => 'Producto agregado al carrito']);
    }


    //Actualizar cantidad
    public function update(Request $request, $productoId)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'cantidad' => 'required|integer|min:1',
        ]);

        $item = $user->carrito()->where('producto_id', $productoId)->first();
        if (!$item) {
            return response()->json(['message' => 'Producto no encontrado en el carrito'], 404);
        }

        $item->cantidad = $request->cantidad;
        $item->save();

        return response()->json(['message' => 'Cantidad actualizada']);
    }


    //Eliminar producto
    public function destroy($productoId)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $item = $user->carrito()->where('producto_id', $productoId)->first();
        if ($item) {
            $item->delete();
        }

        return response()->json(['message' => 'Producto eliminado del carrito']);
    }

    // vaciar carrito
    public function vaciar()
    {
        $user = JWTAuth::parseToken()->authenticate();
        $user->carrito()->delete();

        return response()->json(['message' => 'Carrito vaciado']);
    }

    //Sincronizar carrito de invitado
    public function sync(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'items' => 'required|array',
            'items.*.producto_id' => 'required|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
        ]);

        foreach ($request->items as $itemData) {
            $item = $user->carrito()->where('producto_id', $itemData['producto_id'])->first();
            if ($item) {
                $item->cantidad += $itemData['cantidad'];
                $item->save();
            } else {
                $user->carrito()->create([
                    'producto_id' => $itemData['producto_id'],
                    'cantidad' => $itemData['cantidad'],
                ]);
            }
        }

        return response()->json(['message' => 'Carrito sincronizado correctamente']);
    }

}