import React from 'react';
import { useAppContext } from '../context/AppContext';
import { submitPurchase } from '../api/api';

const Checkout = () => {
  const { cart, clearCart, user } = useAppContext();

  const handlePurchase = async () => {
    if (!user) return alert("Debes iniciar sesión");
    await submitPurchase(cart, user.token);
    clearCart();
    alert("Compra realizada con éxito!");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Confirmar Compra</h1>
      <button onClick={handlePurchase} className="bg-green-600 text-white px-4 py-2 rounded">
        Comprar
      </button>
    </div>
  );
};

export default Checkout;
