<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('envios', function (Blueprint $table) {
            $table->id();

            // Relación con el pedido (único por pedido)
            $table->foreignId('pedido_id')
                  ->constrained('pedidos')
                  ->onDelete('cascade');

            // Datos del cliente
            $table->string('nombre_cliente');           // desde users.name
            $table->string('telefono')->nullable();
            $table->text('direccion');
            $table->string('ciudad');
            $table->string('codigo_postal', 10);

            //Datos del producto
            $table->string('referencia');               // Referencia del producto 
            $table->string('nombre_producto');                   // Nombre del producto en el momento del envío
            $table->integer('cantidad');                // Cantidad pedida
            $table->decimal('precio_unitario', 10, 2)->nullable();  // Precio en el momento (opcional)

            // Estado del envío (más específico que el del pedido)
            $table->enum('estado', ['pendiente', 'enviado', 'en_transito', 'entregado', 'devuelto'])
                  ->default('pendiente');

            // Datos de seguimiento
            $table->enum('metodo_envio', ['standard', 'express']);
            $table->string('transportista')->nullable();
            $table->string('numero_seguimiento')->nullable();

            // Para saber cuándo se marcó como enviado, entregado, etc.
            $table->timestamp('enviado_at')->nullable();
            $table->timestamp('entregado_at')->nullable();

            $table->timestamps();

            // Índices útiles
            $table->index('estado');
            $table->index('enviado_at');
            $table->index('numero_seguimiento');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('envios');
    }
};
