<?php

// database/migrations/2025_01_01_000000_create_carrito_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('carrito', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->unsignedBigInteger('product_id');      // id del producto
            $table->string('nombre');
            $table->string('referencia')->nullable();
            $table->decimal('precio', 10, 2);              // precio unitario
            $table->integer('cantidad');
            $table->string('imagen')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'product_id']);     // evita duplicados del mismo producto
        });
    }

    public function down(): void {
        Schema::dropIfExists('carrito');
    }
};
