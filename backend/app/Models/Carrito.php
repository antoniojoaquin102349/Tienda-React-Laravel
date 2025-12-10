<?php
// app/Models/Carrito.php
namespace App\Models;

use App\Models\User;
use App\Models\Producto;
use Illuminate\Database\Eloquent\Model;

class Carrito extends Model
{
    protected $fillable = [
        'user_id',
        'producto_id',
        'cantidad',
    ];
    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
