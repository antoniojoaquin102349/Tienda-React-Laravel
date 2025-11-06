<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Pedido;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ClientesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Cliente 1: con pedidos reales
        $cliente1 = Cliente::create([
            'nombre'    => 'Ana López',
            'email'     => 'ana.lopez@example.com',
            'telefono'  => '600111222',
            'direccion' => 'Calle del Sol 12, Valencia',
            'password'  => Hash::make('secret123'),
        ]);

        $cliente1->pedidos()->createMany([
            [
                'numero_pedido' => 'PED-2025-001',
                'total'         => 89.99,
                'estado'        => 'entregado',
            ],
            [
                'numero_pedido' => 'PED-2025-015',
                'total'         => 129.50,
                'estado'        => 'pendiente',
            ],
        ]);

        // Cliente 2: con más pedidos
        $cliente2 = Cliente::create([
            'nombre'    => 'Carlos Ruiz',
            'email'     => 'carlos.ruiz@example.com',
            'telefono'  => '600333444',
            'direccion' => 'Av. Libertad 45, Madrid',
            'password'  => Hash::make('carlos2025'),
        ]);

        $cliente2->pedidos()->createMany([
            [
                'numero_pedido' => 'PED-2025-007',
                'total'         => 259.00,
                'estado'        => 'enviado',
            ],
            [
                'numero_pedido' => 'PED-2025-022',
                'total'         => 49.95,
                'estado'        => 'entregado',
            ],
            [
                'numero_pedido' => 'PED-2025-031',
                'total'         => 199.99,
                'estado'        => 'cancelado',
            ],
        ]);

        // Cliente 3: sin pedidos
        Cliente::create([
            'nombre'    => 'Laura Gómez',
            'email'     => 'laura.gomez@example.com',
            'telefono'  => '600555666',
            'direccion' => 'Plaza Mayor 8, Sevilla',
            'password'  => Hash::make('laura123'),
        ]);

        // Opcional: 20 clientes con datos aleatorios + pedidos aleatorios
        Cliente::factory()
            ->count(20)
            ->has(Pedido::factory()->count(3)) // cada uno con 3 pedidos
            ->create();
    }
}