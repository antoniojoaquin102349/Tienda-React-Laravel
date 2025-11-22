// src/pages/Carro.tsx
import { useEffect, useState } from "react";

interface ProductoCarrito {
  id: number;
  referencia: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string | null;
}

const Carro = () => {
  const [carro, setCarro] = useState<ProductoCarrito[]>([]);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) setCarro(JSON.parse(data));
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carro));
  }, [carro]);

  const eliminarProducto = (id: number) => {
    const nuevo = carro
      .map((item) => (item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item))
      .filter((item) => item.cantidad > 0);
    setCarro(nuevo);
  };

  const total = carro.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const pagar = () => {
    setMensaje("¡Compra realizada con éxito! Gracias");
    setCarro([]);
    localStorage.removeItem("carrito");
    setTimeout(() => (window.location.href = "/"), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10">Carrito de Compras</h1>

        {mensaje && (
          <div className="text-center text-2xl text-white bg-green-600 py-4 rounded-lg mb-8">
            {mensaje}
          </div>
        )}

        {carro.length === 0 ? (
          <p className="text-center text-xl text-gray-600">Tu carrito está vacío</p>
        ) : (
          <>
            {carro.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-xl shadow mb-6 flex gap-6 items-center"
              >
                <img
                  src={item.imagen || "https://via.placeholder.com/120?text=Producto"}
                  alt={item.nombre}
                  className="w-32 h-32 object-contain rounded-lg bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{item.nombre}</h3>
                  <p className="text-gray-600">Ref: {item.referencia}</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">
                    {(item.precio * item.cantidad).toFixed(2)} €
                  </p>
                  <p>Cantidad: {item.cantidad}</p>
                </div>
                <button
                  onClick={() => eliminarProducto(item.id)}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            ))}

            <div className="text-right text-3xl font-bold mb-8">
              Total: {total.toFixed(2)} €
            </div>

            <button
              onClick={pagar}
              className="w-full bg-blue-600 text-white text-xl font-bold py-5 rounded-xl hover:bg-blue-700"
            >
              Confirmar y Pagar
            </button>
          </>
        )}

        <div className="text-center mt-10">
          <a href="/" className="text-blue-600 hover:underline text-lg">
            ← Seguir comprando
          </a>
        </div>
      </div>
    </div>
  );
};

export default Carro;