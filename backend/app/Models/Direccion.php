<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Direccion extends Model
{
    protected $table = 'direcciones';

    protected $fillable = [
        'cliente_id', 'tipo', 'nombre_destinatario', 'telefono',
        'direccion', 'ciudad', 'provincia', 'codigo_postal',
        'pais', 'predeterminada'
    ];

    protected $casts = [
        'predeterminada' => 'boolean',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }
}