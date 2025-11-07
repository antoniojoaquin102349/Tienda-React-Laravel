<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';

    protected $fillable = [
        'categoria_id', 'nombre', 'slug', 'descripcion_corta',
        'descripcion_larga', 'precio', 'precio_oferta', 'stock',
        'imagen', 'destacado', 'activo'
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'precio_oferta' => 'decimal:2',
        'destacado' => 'boolean',
        'activo' => 'boolean',
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function pedidos()
    {
        return $this->belongsToMany(Pedido::class, 'pedido_productos')
                    ->withPivot('cantidad', 'precio_unitario', 'precio_oferta', 'subtotal')
                    ->withTimestamps();
    }

    // Accesor: precio final (con oferta si aplica)
    public function getPrecioFinalAttribute()
    {
        return $this->precio_oferta ?? $this->precio;
    }

    // Accesor: ruta de imagen
    public function getImagenUrlAttribute()
    {
        return $this->imagen ? asset('storage/' . $this->imagen) : asset('images/no-image.png');
    }
}