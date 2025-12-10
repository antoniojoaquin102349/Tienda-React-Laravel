<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Mail\UsuarioCreadoMail;
use App\Models\PedidoProducto;
use Illuminate\Http\Request;
use App\Models\Producto;
use App\Models\Pedido;
use App\Models\Envio;
use App\Models\Datos; // Cambiar el nombre del modelo para que coincida con la tabla "datos"
use App\Models\User;

class PedidoController extends Controller
{
    private function generarPassword()
    {
        return bin2hex(random_bytes(4));
    }
    public function checkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $existe = User::where('email', $request->email)->exists();

        return response()->json([
            'existe' => $existe
        ]);
    }
    public function store(Request $request)
    {
        $carrito = $request->carrito;
        $datos = $request->cliente;

        if (!$datos || !$carrito || empty($carrito)) {
            return response()->json([
                "success" => false,
                "message" => "Faltan datos del cliente o carrito vacío"
            ], 400);
        }

        // Intentamos obtener el usuario por el token enviado
        $user = JWTAuth::user();

        // SI NO HAY TOKEN → es invitado
        if (!$user) {
            // Verificar si el email ya está registrado
            $userExistente = User::where('email', $datos['email'])->first();

            if ($userExistente) {
                // Usuario ya registrado pero no autenticado → bloquear
                return response()->json([
                    "success" => false,
                    "message" => "Para continuar con el pedido, debes iniciar sesión con esta cuenta.",
                    "requiere_login" => true
                ], 401);
            }

            // Usuario no existe → crear nuevo
            $password = $this->generarPassword();
            $user = User::create([
                'name' => $datos['nombre'],
                'email' => $datos['email'],
                'password' => bcrypt($password),
                'telefono' => $datos['telefono'] ?? null,
                'direccion' => $datos['direccion'],
                'ciudad' => $datos['ciudad'],
                'cp' => $datos['cp'],
            ]);

            // ✅ Aquí va el bloque para enviar el correo
            try {
                Mail::to($user->email)->send(new UsuarioCreadoMail($user, $password));
            } catch (\Exception $e) {
                \Log::error("Error enviando correo de registro automático: " . $e->getMessage());
            }
        }

        // Verificar si ya existe un registro en la tabla "datos" para este usuario
        $existeRegistroPrimeraCompra = Datos::where('user_id', $user->id)->exists();

        // Solo guardar los datos si no existe un registro previo en la tabla "datos"
        if (!$existeRegistroPrimeraCompra) {
            Datos::create([
                'user_id' => $user->id,
                'telefono' => $datos['telefono'],
                'direccion' => $datos['direccion'],
                'ciudad' => $datos['ciudad'],
                'codigo_postal' => $datos['cp'],
                'numero_tarjeta' => isset($datos['guardarPago']) && $datos['guardarPago'] 
                    ? '**** **** **** ' . substr($datos['numeroTarjeta'], -4) 
                    : null,
                'nombre_tarjeta' => isset($datos['guardarPago']) && $datos['guardarPago'] 
                    ? $datos['nombreTarjeta'] 
                    : null,
                'numero_seguridad' => null, // Nunca se guarda el CVV por seguridad
                'fecha_vencimiento' => isset($datos['guardarPago']) && $datos['guardarPago'] 
                    ? $datos['vencimiento'] 
                    : null,
            ]);
        }
        // Si ya existe un registro y el usuario marca explícitamente el checkbox para guardar los datos de pago
        else if (isset($datos['guardarPago']) && $datos['guardarPago']) {
            Datos::where('user_id', $user->id)->update([
                'numero_tarjeta' => '**** **** **** ' . substr($datos['numeroTarjeta'], -4),
                'nombre_tarjeta' => $datos['nombreTarjeta'],
                'fecha_vencimiento' => $datos['vencimiento'],
            ]);
        }

        // Generar/Refrescar token JWT siempre
        $token = JWTAuth::fromUser($user);

        // Calcular total
        $total = collect($carrito)->sum(fn($i) => $i['precio'] * $i['cantidad']);

        // Crear pedido
        $pedido = Pedido::create([
            'user_id' => $user->id,
            'total' => $total,
            'estado' => 'pendiente',
        ]);

        // Guardar productos del pedido
        foreach ($carrito as $item) {
            PedidoProducto::create([
                'pedido_id' => $pedido->id,
                'producto_id' => $item['id'] ?? null,
                'nombre' => $item['nombre'],
                'imagen' => $item['imagen'] ?? '',
                'precio' => $item['precio'],
                'cantidad' => $item['cantidad'],
            ]);

            if (isset($item['id'])) {
                $producto = Producto::find($item['id']);
                if ($producto) {
                    $producto->stock = max(0, $producto->stock - $item['cantidad']);
		            $producto->vendido = $producto->vendido + $item['cantidad'];
                    $producto->save();
                }
            }
        }

        // Obtener los datos del cliente desde la tabla datos
        $datos = Datos::where('user_id', $user->id)->first();

        if (!$datos) {
            // Si no existen datos, evitamos romper el servidor
            return response()->json([
                'error' => 'No se encontraron los datos del usuario.'
            ], 400);
        }

        // Crear un registro de envío para cada pedido
        $primerProducto = $carrito[0]; // Tomamos un producto representativo para referencia
        Envio::create([
            'pedido_id' => $pedido->id,
            'nombre_cliente' => $user->name,
            'telefono' => $datos->telefono,
            'direccion' => $datos->direccion,
            'ciudad' => $datos->ciudad,
            'codigo_postal' => $datos->codigo_postal,
            'referencia' => $primerProducto['referencia'] ?? 'N/A', // Puedes usar la referencia real del producto
            'nombre_producto' => $primerProducto['nombre'],
            'cantidad' => $primerProducto['cantidad'],
            'precio_unitario' => $primerProducto['precio'],
            'estado' => 'pendiente',
            'metodo_envio' => 'standard', // o puedes recibirlo desde el request
            'transportista' => null,
            'numero_seguimiento' => null,
        ]);

        return response()->json([
            "success" => true,
            "message" => $user->wasRecentlyCreated
                ? "¡Pedido creado! Hemos creado tu cuenta y enviado tu contraseña."
                : "¡Pedido creado correctamente!",
            "pedido_id" => $pedido->id,
            "es_primera_compra" => !$existeRegistroPrimeraCompra,
            "token" => $token
        ], 201);
        
    }
    public function historial()
    {
        $pedidos = Auth::user()->pedidos()->with('productos')->latest()->get();

        return response()->json($pedidos);
    }
    
    
    public function misPedidos()
    {
        $user = JWTAuth::user();

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Para continuar, debes iniciar sesión.",
                "requiere_login" => true
            ], 401);
        }

        // CARGAMOS TODO LO NECESARIO EN UNA SOLA QUERY
        $pedidos = Pedido::with([
            'productos' => function ($q) {
                $q->select('productos.id', 'productos.nombre', 'productos.referencia', 'productos.precio', 'productos.imagen')
                ->withPivot('cantidad', 'precio', 'nombre', 'imagen'); // Añadimos imagen también
            },
            'envio' // ← ¡¡ESTO ES LO IMPORTANTE!! Cargamos la relación envío (hasOne)
        ])
        ->where('user_id', $user->id)
        ->latest()
        ->get();

        // Procesamos los datos para adaptarlos al frontend
        $pedidos->each(function ($pedido) {
            // 1. Añadimos los datos del envío en el formato que espera tu frontend
            $enviosEnviados = [];

            if ($pedido->envio) {
                $enviosEnviados[] = [
                    'nombre_producto'     => $pedido->envio->nombre_producto ?? 'Varios productos',
                    'transportista'       => $pedido->envio->transportista,
                    'numero_seguimiento'  => $pedido->envio->numero_seguimiento,
                ];
            }

            // Añadimos la propiedad que tu interfaz Pedido espera
            $pedido->envios_enviados = $enviosEnviados;

            // 2. Añadimos cantidad, precio, nombre e imagen desde el pivot a los productos
            $pedido->productos->each(function ($prod) {
                $prod->cantidad = $prod->pivot->cantidad ?? 1;
                $prod->precio   = $prod->pivot->precio   ?? $prod->precio;
                $prod->nombre   = $prod->pivot->nombre   ?? $prod->nombre;
                $prod->imagen   = $prod->pivot->imagen   ?? $prod->imagen;
            });
        });

        return response()->json([
            "success" => true,
            "pedidos" => $pedidos
        ]);
    }
}    