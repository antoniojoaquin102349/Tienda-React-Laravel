<?php

// database/migrations/2025_01_01_000000_create_carrito_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('carritos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // usuario propietario
            $table->foreignId('producto_id')->constrained()->onDelete('cascade'); // producto añadido
            $table->integer('cantidad');
            $table->timestamps();
            $table->unique(['user_id', 'producto_id']);     // evita duplicados del mismo producto
        });
    }

    public function down(): void {
        Schema::dropIfExists('carritos');
    }
};
