<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('email')->unique();
            $table->string('telefono')->nullable();
            $table->string('password'); // Hasheado con Hash::make()
            $table->string('direccion')->nullable(); // Para envíos
            $table->string('ciudad')->nullable();
            $table->string('codigo_postal')->nullable();
            $table->string('pais')->default('España');
            $table->boolean('activo')->default(true); // Para desactivar cuentas
            $table->timestamp('email_verified_at')->nullable(); // Si usas verificación
            $table->rememberToken(); // Para "recordarme"
            $table->timestamps();

            // Índices útiles
            $table->index('email');
            $table->index('activo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clientes');
    }
};