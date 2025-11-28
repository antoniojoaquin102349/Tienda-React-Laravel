<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('datos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('telefono')->nullable();
            $table->text('direccion');
            $table->string('ciudad');
            $table->string('codigo_postal', 10);
            $table->string('numero_tarjeta', 19)->nullable();
            $table->string('nombre_tarjeta')->nullable();
            $table->string('numero_seguridad')->nullable();
            $table->string('fecha_vencimiento', 5)->nullable();
            $table->boolean('metodo_pago_guardado')->default(false);
            
            $table->timestamps();

            // Restricción de clave única: cada usuario solo puede tener un registro
            $table->unique('user_id');

            // Relación con la tabla users
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('datos');
    }
};
