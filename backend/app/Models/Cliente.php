<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Cliente extends Authenticatable
{
    use Notifiable;

    protected $table = 'clientes';

    protected $fillable = [
        'nombre', 'apellido', 'email', 'password', 'telefono'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'email_verified' => 'boolean',
    ];

    public function pedidos()
    {
        return $this->hasMany(Pedido::class);
    }

    public function direcciones()
    {
        return $this->hasMany(Direccion::class);
    }

    // Dirección de envío predeterminada
    public function direccionEnvioPredeterminada()
    {
        return $this->direcciones()->where('tipo', 'envio')->where('predeterminada', true)->first();
    }
}