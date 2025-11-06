<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Pedido;
use App\Models\PedidoItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PedidosTableSeeder extends Seeder
{
    public function run(): void
    {
        // Crear clientes si no existen
        $clientes = Cliente::factory()->count(10)->create();

        $metodosPago = ['tarjeta', 'paypal', 'transferencia', 'contra_reembolso'];
        $estados = ['pendiente', 'pagado', 'enviado', 'entregado', 'cancelado'];
        $productosNombres = ['Camiseta', 'Pantalón', 'Zapatillas', 'Gorra', 'Calcetines', 'Sudadera', 'Bolso', 'Reloj', 'Laptop', 'Monitor'];

        foreach ($clientes as $index => $cliente) {
            $numPedidos = rand(1, 5);

            for ($i = 0; $i < $numPedidos; $i++) {
                $subtotal = 0;
                $items = [];
                $numItems = rand(1, 5);

                // Generar items
                for ($j = 0; $j < $numItems; $j++) {
                    $nombre = fake()->randomElement($productosNombres);
                    $cantidad = rand(1, 3);
                    $precio = fake()->randomFloat(2, 10, 300);
                    $itemSubtotal = $cantidad * $precio;
                    $subtotal += $itemSubtotal;

                    $items[] = [
                        'producto_nombre' => $nombre,
                        'cantidad' => $cantidad,
                        'precio_unitario' => $precio,
                        'subtotal' => $itemSubtotal,
                    ];
                }

                $impuestos = $subtotal * 0.21; // 21% IVA
                $descuento = ($index % 3 == 0) ? $subtotal * 0.10 : 0; // 10% en cada 3er cliente
                $total = $subtotal + $impuestos - $descuento;

                $fechaPedido = now()->subDays(rand(1, 90));

                // Crear pedido
                $pedido = Pedido::create([
                    'cliente_id' => $cliente->id,
                    'numero_pedido' => 'PED-' . date('Y') . '-' . str_pad(Pedido::count() + 1, 6, '0', STR_PAD_LEFT),
                    'subtotal' => $subtotal,
                    'impuestos' => $impuestos,
                    'descuento' => $descuento,
                    'total' => $total,
                    'metodo_pago' => fake()->randomElement($metodosPago),
                    'estado' => fake()->randomElement($estados),
                    'fecha_pedido' => $fechaPedido,
                    'fecha_envio' => (rand(0, 1) ? $fechaPedido->copy()->addDays(rand(1, 5)) : null),
                    'fecha_entrega' => (rand(0, 1) ? $fechaPedido->copy()->addDays(rand(6, 15)) : null),
                    'direccion_envio' => [
                        'calle' => fake()->streetAddress(),
                        'ciudad' => fake()->city(),
                        'cp' => fake()->postcode(),
                        'pais' => 'España',
                    ],
                    'notas' => rand(0, 2) ? fake()->sentence() : null,
                ]);

                // Crear items del pedido
                foreach ($items as $item) {
                    PedidoItem::create(array_merge($item, ['pedido_id' => $pedido->id]));
                }
            }
        }

        // Pedido VIP realista
        $vip = Cliente::create([
            'nombre' => 'TechCorp S.A.',
            'email' => 'compras@techcorp.es',
            'telefono' => '911234567',
            'direccion' => 'Calle Innovación 10, Madrid',
            'password' => Hash::make('tech2025'),
        ]);

        $pedidoVip = Pedido::create([
            'cliente_id' => $vip->id,
            'numero_pedido' => 'PED-2025-000999',
            'subtotal' => 2499.98,
            'impuestos' => 524.99,
            'descuento' => 250.00,
            'total' => 2774.97,
            'metodo_pago' => 'transferencia',
            'estado' => 'entregado',
            'fecha_pedido' => '2025-10-20',
            'fecha_envio' => '2025-10-22',
            'fecha_entrega' => '2025-10-25',
            'direccion_envio' => json_encode([
                'calle' => 'Av. Tecnología 45',
                'ciudad' => 'Barcelona',
                'cp' => '08001',
                'pais' => 'España'
            ]),
            'notas' => 'Urgente - Entregar en recepción',
        ]);

        // Items VIP
        PedidoItem::insert([
            ['pedido_id' => $pedidoVip->id, 'producto_nombre' => 'MacBook Pro 16"', 'cantidad' => 1, 'precio_unitario' => 2499.99, 'subtotal' => 2499.99, 'created_at' => now(), 'updated_at' => now()],
            ['pedido_id' => $pedidoVip->id, 'producto_nombre' => 'Magic Mouse', 'cantidad' => 2, 'precio_unitario' => 79.00, 'subtotal' => 158.00, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}