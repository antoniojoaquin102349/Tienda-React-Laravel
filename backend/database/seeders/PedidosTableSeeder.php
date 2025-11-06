<?php

    namespace Database\Seeders;

    use App\Models\Cliente;
    use App\Models\Pedido;
    use Illuminate\Database\Seeder;
    use Illuminate\Support\Facades\Hash;

    class PedidosTableSeeder extends Seeder
    {
        /**
         * Run the database seeds.
         */
        public function run(): void
        {
            // Aseguramos que existan clientes
            $clientes = Cliente::factory()->count(5)->create();

            foreach ($clientes as $cliente) {
                // Cada cliente tiene entre 1 y 4 pedidos
                $numPedidos = rand(1, 4);
                $pedidosArray = [];

                for ($i = 1; $i <= $numPedidos; $i++) {
                    $productos = $this->generarProductosAleatorios();

                    $pedidosArray[] = [
                        'numero'     => 'PED-' . date('Y') . '-' . str_pad($cliente->id * 100 + $i, 4, '0', STR_PAD_LEFT),
                        'fecha'      => now()->subDays(rand(1, 90))->format('Y-m-d'),
                        'total'      => array_sum(array_column($productos, 'subtotal')),
                        'estado'     => fake()->randomElement(['pendiente', 'enviado', 'entregado', 'cancelado']),
                        'productos'  => $productos,
                    ];
                }

                // Guardamos todos los pedidos del cliente en un solo registro
                Pedido::create([
                    'cliente_id' => $cliente->id,
                    'pedidos'    => $pedidosArray,
                ]);
            }

            // Cliente VIP con pedidos reales
            $vip = Cliente::create([
                'nombre'    => 'Empresa XYZ S.L.',
                'email'     => 'contacto@xyz.com',
                'telefono'  => '900200300',
                'direccion' => 'Polígono Industrial, Madrid',
                'password'  => Hash::make('xyz2025'),
            ]);

            Pedido::create([
                'cliente_id' => $vip->id,
                'pedidos'    => [
                    [
                        'numero' => 'PED-2025-1001',
                        'fecha'  => '2025-10-15',
                        'total'  => 1299.99,
                        'estado' => 'entregado',
                        'productos' => [
                            ['nombre' => 'Laptop Pro', 'cantidad' => 1, 'precio' => 1099.99, 'subtotal' => 1099.99],
                            ['nombre' => 'Ratón inalámbrico', 'cantidad' => 2, 'precio' => 99.99, 'subtotal' => 199.98],
                        ],
                    ],
                    [
                        'numero' => 'PED-2025-1025',
                        'fecha'  => '2025-11-01',
                        'total'  => 449.95,
                        'estado' => 'enviado',
                        'productos' => [
                            ['nombre' => 'Monitor 27"', 'cantidad' => 1, 'precio' => 399.95, 'subtotal' => 399.95],
                            ['nombre' => 'Soporte ergonómico', 'cantidad' => 1, 'precio' => 50.00, 'subtotal' => 50.00],
                        ],
                    ],
                ],
            ]);
        }

        /**
         * Genera productos aleatorios para un pedido
         */
        private function generarProductosAleatorios($min = 1, $max = 5): array
        {
            $productos = [];
            $nombres = ['Camiseta', 'Pantalón', 'Zapatillas', 'Gorra', 'Calcetines', 'Sudadera', 'Bolso', 'Reloj'];

            $cantidadProductos = rand($min, $max);

            for ($j = 0; $j < $cantidadProductos; $j++) {
                $nombre = fake()->randomElement($nombres);
                $cantidad = rand(1, 3);
                $precio = fake()->randomFloat(2, 10, 150);
                $subtotal = $cantidad * $precio;

                $productos[] = [
                    'nombre'   => $nombre,
                    'cantidad' => $cantidad,
                    'precio'   => $precio,
                    'subtotal' => $subtotal,
                ];
            }

            return $productos;
        }
    };
