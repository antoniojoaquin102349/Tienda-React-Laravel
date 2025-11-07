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
        Schema::create('direcciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cliente_id')->constrained('clientes')->onDelete('cascade');
            $table->string('tipo')->default('envio'); // envio, facturacion
            $table->string('nombre_destinatario');
            $table->string('telefono');
            $table->string('direccion');
            $table->string('ciudad');
            $table->string('provincia');
            $table->string('codigo_postal');
            $table->string('pais')->default('España');
            $table->boolean('predeterminada')->default(false);
            $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('direcciones');
    }
};
