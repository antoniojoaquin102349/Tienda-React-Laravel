<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Categoria;
use App\Models\Producto;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        // Aseguramos que exista la categoría "Accesorios 4x4"
        $categoria = Categoria::firstOrCreate(
            ['slug' => 'accesorios-4x4'],
            [
                'nombre' => 'Accesorios 4x4',
                'slug' => 'accesorios-4x4',
                'descripcion' => 'Accesorios y repuestos para vehículos 4x4',
                'activa' => true
            ]
        );

        $productos = [
            [
                'nombre' => 'Llantas BFGoodrich All-Terrain T/A KO2 33x12.50R15',
                'descripcion_corta' => 'Llantas todoterreno de alto rendimiento. Ideal para barro, roca y carretera.',
                'precio' => 1250.00,
                'precio_oferta' => 1120.00,
                'stock' => 8,
                'imagen' => 'llantas-bfgoodrich-ko2.jpg',
                'destacado' => true,
            ],
            [
                'nombre' => 'Winch Warn Zeon 10-S 10000 lbs',
                'descripcion_corta' => 'Winch eléctrico con cable sintético. Capacidad 10,000 lbs.',
                'precio' => 1890.00,
                'stock' => 3,
                'imagen' => 'winch-warn-zeon.jpg',
                'destacado' => true,
            ],
            [
                'nombre' => 'Snorkel Safari para Toyota Hilux',
                'descripcion_corta' => 'Snorkel de alto flujo. Permite vadear ríos profundos.',
                'precio' => 420.00,
                'precio_oferta' => 380.00,
                'stock' => 12,
                'imagen' => 'snorkel-safari-hilux.jpg',
            ],
            [
                'nombre' => 'Suspensión Old Man Emu +5cm Jeep Wrangler',
                'descripcion_corta' => 'Kit de suspensión completa. Mejora altura y confort off-road.',
                'precio' => 2150.00,
                'stock' => 2,
                'imagen' => 'suspension-ome-jeep.jpg',
                'destacado' => true,
            ],
            [
                'nombre' => 'Batería Optima RedTop 34/78',
                'descripcion_corta' => 'Batería de arranque para 4x4. Alta resistencia a vibraciones.',
                'precio' => 310.00,
                'stock' => 15,
                'imagen' => 'bateria-optima-redtop.jpg',
            ],
        ];

        foreach ($productos as $producto) {
            Producto::create([
                'categoria_id' => $categoria->id,
                'nombre' => $producto['nombre'],
                'slug' => Str::slug($producto['nombre']),
                'descripcion_corta' => $producto['descripcion_corta'],
                'descripcion_larga' => "Producto de alta calidad para vehículos 4x4. Garantía de durabilidad y rendimiento en condiciones extremas.",
                'precio' => $producto['precio'],
                'precio_oferta' => $producto['precio_oferta'] ?? null,
                'stock' => $producto['stock'],
                'imagen' => $producto['imagen'],
                'destacado' => $producto['destacado'] ?? false,
                'activo' => true,
            ]);
        }
    }
}