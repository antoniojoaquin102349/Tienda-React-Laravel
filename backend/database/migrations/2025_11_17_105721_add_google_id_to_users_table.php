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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'google_id')) {
                $table->string('google_id')->nullable()->after('email');
            }
            //$table->string('google_id')->nullable()->unique()->after('email');
            // Opcional (recomendado si vas a usar más proveedores):
            // $table->string('provider')->nullable()->after('google_id');        // google, github, etc.
            // $table->string('provider_id')->nullable()->unique()->after('provider');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('google_id');
            // $table->dropColumn(['provider', 'provider_id']);
        });
    }
};
