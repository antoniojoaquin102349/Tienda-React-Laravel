<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('referencia')->unique()->nullable(false);
            $table->string('nombre');
            $table->string('categoria')->nullable();  // <-- unificada
            $table->decimal('precio', 10, 2);
            $table->integer('stock')->default(0);
            $table->boolean('vendido')->default(false);  // <-- unificada
            $table->text('descripcion')->nullable();
            $table->string('imagen')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
