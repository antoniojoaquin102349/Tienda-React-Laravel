import { Trash2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cart, removeFromCart, completePurchase, user } = useApp();

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert("Debes iniciar sesión");
      return;
    }
    try {
      await completePurchase();
      alert("¡Compra realizada con éxito!");
    } catch {
      alert("Error al procesar la compra");
    }
  };

  if (cart.length === 0)
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-xl">Tu carrito está vacío</p>
        <Link to="/" className="text-indigo-600 underline mt-4 inline-block">
          Seguir comprando
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>
      <div className="bg-white rounded-lg shadow">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border-b">
            <img src={item.image} alt="" className="w-20 h-20 object-contain" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-600">
                {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
        <div className="p-6">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Confirmar compra
          </button>
        </div>
      </div>
    </div>
  );
}