<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductosSeeder extends Seeder
{
    public function run()
    {
        $productos = [
            [
                'referencia'  => 'RF001',
                'nombre'      => 'Parachoques delantero reforzado Off-Road',
                'categoria'   => 'Carroceria',
                'precio'      => 450.00,
                'stock'       => 12,
                'vendido'     => 4,
                'descripcion' => 'Parachoques de acero reforzado para Land Rover Defender TD5, ideal para rutas extremas.',
                'imagen'      => 'paragolpes.jpg',
            ],
            [
                'referencia'  => 'RF010',
                'nombre'      => 'Kit de elevación suspensión +2"',
                'categoria'   => 'Suspension',
                'precio'      => 680.00,
                'stock'       => 8,
                'vendido'     => 3,
                'descripcion' => 'Kit completo de suspensión para mejorar altura y recorrido en terrenos difíciles.',
                'imagen'      => 'suspension.jpg',
            ],
            [
                'referencia'  => 'RF002',
                'nombre'      => 'Intercooler de alto rendimiento',
                'categoria'   => 'Mecanica',
                'precio'      => 520.00,
                'stock'       => 6,
                'vendido'     => 2,
                'descripcion' => 'Intercooler optimizado para aumentar potencia y reducir temperatura en conducción extrema.',
                'imagen'      => 'intercooler_performance.jpg',
            ],
            [
                'referencia'  => 'RF225',
                'nombre'      => 'Juego de llantas beadlock 16"',
                'categoria'   => 'Ruedas',
                'precio'      => 850.00,
                'stock'       => 10,
                'vendido'     => 5,
                'descripcion' => 'Llantas beadlock especiales para evitar destalonamientos en rutas extremas.',
                'imagen'      => 'llantas.jpg',
            ],
            [
                'referencia'  => 'RF158',
                'nombre'      => 'Winch eléctrico 12.000 lb',
                'categoria'   => 'Electricidad',
                'precio'      => 599.00,
                'stock'       => 7,
                'vendido'     => 3,
                'descripcion' => 'Winch profesional con capacidad de 12.000 lb para rescates todoterreno.',
                'imagen'      => 'cabrestante.jpg',
            ],
            [
                'referencia'  => 'RF022',
                'nombre'      => 'Snorkel Safari para TD5',
                'categoria'   => 'Accesorios',
                'precio'      => 199.00,
                'stock'       => 15,
                'vendido'     => 6,
                'descripcion' => 'Snorkel reforzado para mejorar admisión y evitar entrada de agua en travesías.',
                'imagen'      => 'snorkel_safari.jpg',
            ],
            [
                'referencia'  => 'RF023',
                'nombre'      => 'Protector de bajos completo',
                'categoria'   => 'Carroceria',
                'precio'      => 380.00,
                'stock'       => 9,
                'vendido'     => 3,
                'descripcion' => 'Plancha de protección de aluminio 8mm para diferenciales y motor.',
                'imagen'      => 'protector_bajos.jpg',
            ],
            [
                'referencia'  => 'RF016',
                'nombre'      => 'Amortiguadores de gas Heavy Duty',
                'categoria'   => 'Suspension',
                'precio'      => 430.00,
                'stock'       => 10,
                'vendido'     => 4,
                'descripcion' => 'Amortiguadores reforzados para absorción máxima en terrenos de alta exigencia.',
                'imagen'      => 'amortiguadores.jpg',
            ],
            [
                'referencia'  => 'RF003',
                'nombre'      => 'Kit de embrague reforzado',
                'categoria'   => 'Mecanica',
                'precio'      => 490.00,
                'stock'       => 11,
                'vendido'     => 5,
                'descripcion' => 'Embrague resistente para soportar mayor torque en rutas pesadas.',
                'imagen'      => 'embrague_reforzado.jpg',
            ],
            [
                'referencia'  => 'RF215',
                'nombre'      => 'Neumáticos Mud Terrain 33"',
                'categoria'   => 'Ruedas',
                'precio'      => 760.00,
                'stock'       => 14,
                'vendido'     => 6,
                'descripcion' => 'Neumáticos diseñados para barro y rutas extremas de montaña.',
                'imagen'      => 'ruedas.jpg',
            ],
            [
                'referencia'  => 'RF148',
                'nombre'      => 'Faros LED homologados Off-Road',
                'categoria'   => 'Electricidad',
                'precio'      => 160.00,
                'stock'       => 20,
                'vendido'     => 8,
                'descripcion' => 'Faros LED de largo alcance ideales para conducción nocturna en rutas extremas.',
                'imagen'      => 'faros_led.jpg',
            ],
            [
                'referencia'  => 'RF014',
                'nombre'      => 'Portaequipajes reforzado techo',
                'categoria'   => 'Accesorios',
                'precio'      => 320.00,
                'stock'       => 6,
                'vendido'     => 2,
                'descripcion' => 'Portaequipajes metálico de gran capacidad para expediciones largas.',
                'imagen'      => 'portaequipajes_reforzado.jpg',
            ],
            [
                'referencia'  => 'RF013',
                'nombre'      => 'Aletas laterales Heavy Duty',
                'categoria'   => 'Carroceria',
                'precio'      => 135.00,
                'stock'       => 18,
                'vendido'     => 7,
                'descripcion' => 'Aletas laterales resistentes para proteger la carrocería de golpes y barro.',
                'imagen'      => 'aletas_hd.jpg',
            ],
            [
                'referencia'  => 'RF020',
                'nombre'      => 'Silentblocks de poliuretano',
                'categoria'   => 'Suspension',
                'precio'      => 95.00,
                'stock'       => 25,
                'vendido'     => 12,
                'descripcion' => 'Silentblocks reforzados para mayor durabilidad en uso extremo.',
                'imagen'      => 'silentblocks_pu.jpg',
            ],
            [
                'referencia'  => 'RF017',
                'nombre'      => 'Placa de arena de rescate',
                'categoria'   => 'Accesorios',
                'precio'      => 75.00,
                'stock'       => 30,
                'vendido'     => 10,
                'descripcion' => 'Placas ligeras para recuperar el vehículo en arena, barro o nieve.',
                'imagen'      => 'placas_rescate.jpg',
            ],
        ];

        foreach ($productos as $producto) {
            DB::table('productos')->insert([
                'referencia'  => $producto['referencia'],
                'nombre'      => $producto['nombre'],
                'categoria'   => $producto['categoria'],
                'precio'      => $producto['precio'],
                'stock'       => $producto['stock'],
                'vendido'     => $producto['vendido'],
                'descripcion' => $producto['descripcion'],
                'imagen'      => '/uploads/' . $producto['imagen'], // ← aquí se agrega la ruta correcta
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }
    }
}




