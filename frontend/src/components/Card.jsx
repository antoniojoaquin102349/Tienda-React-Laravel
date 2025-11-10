import React from 'react';
import { useAppContext } from '../context/AppContext';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useAppContext();

  return (
    <div className="p-4 border rounded shadow max-w-md">
      <h2 className="text-xl font-bold mb-2">Carrito</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        cart.map(p => (
          <div key={p.id} className="flex justify-between mb-2">
            <span>{p.name}</span>
            <button onClick={() => removeFromCart(p.id)} className="text-red-600">Eliminar</button>
          </div>
        ))
      )}
      {cart.length > 0 && (
        <button onClick={clearCart} className="mt-2 bg-red-600 text-white px-4 py-2 rounded">Vaciar carrito</button>
      )}
    </div>
  );
};

export default Cart;
