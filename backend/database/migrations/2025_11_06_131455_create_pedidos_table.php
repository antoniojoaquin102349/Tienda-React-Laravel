<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->string('numero_pedido')->unique();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('impuestos', 10, 2)->default(0);
            $table->decimal('descuento', 10, 2)->default(0);
            $table->decimal('total', 10, 2);
            $table->string('metodo_pago'); // tarjeta, paypal, transferencia, etc.
            $table->string('estado')->default('pendiente'); // pendiente, pagado, enviado, entregado, cancelado
            $table->date('fecha_pedido');
            $table->date('fecha_envio')->nullable();
            $table->date('fecha_entrega')->nullable();
            $table->json('direccion_envio'); // {calle, ciudad, cp, pais}
            $table->text('notas')->nullable();
            $table->timestamps();

            // Índices para rendimiento
            $table->index(['cliente_id', 'estado']);
            $table->index('fecha_pedido');
            $table->index('numero_pedido');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
