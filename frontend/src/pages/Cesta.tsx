import { useEffect, useState } from "react";

interface ProductoCarrito {
  referencia: string;
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

const Carro = () => {
  const [carro, setCarro] = useState<ProductoCarrito[]>([]);
  const [mensaje, setMensaje] = useState<string>("");

  // Cargar carrito desde localStorage (similar a $_SESSION)
  useEffect(() => {
    const data = localStorage.getItem("carro");
    if (data) setCarro(JSON.parse(data));
  }, []);

  // Guardar cambios automáticamente
  useEffect(() => {
    localStorage.setItem("carro", JSON.stringify(carro));
  }, [carro]);

  // Eliminar una unidad o producto entero
  const eliminarProducto = (referencia: string) => {
    const nuevoCarro = carro
      .map((item) =>
        item.referencia === referencia
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      )
      .filter((item) => item.cantidad > 0);

    setCarro(nuevoCarro);
  };

  // Procesar pago (simulación)
  const pagar = () => {
    if (carro.length === 0) {
      setMensaje("❌ El carrito está vacío.");
      return;
    }

    // Aquí iría llamada al backend si quieres actualizar stock
    setMensaje("✅ ¡Gracias por tu compra!");
    setCarro([]);

    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };

  // Calcular total
  const total = carro.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🛒 Carrito de Compras</h2>

      {mensaje && (
        <div className="p-3 mb-4 bg-green-200 text-green-800 rounded">
          {mensaje}
        </div>
      )}

      {carro.length === 0 ? (
        <p className="text-center text-gray-600">El carrito está vacío.</p>
      ) : (
        <>
          <div className="space-y-4">
            {carro.map((item) => (
              <div
                key={item.referencia}
                className="flex items-center gap-4 p-4 border rounded shadow"
              >
                <img
                  src={item.imagen}
                  alt={item.nombre}
                  className="w-20 h-20 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-bold">{item.nombre}</p>
                  <p>
                    {item.precio.toFixed(2)} € x {item.cantidad} unidad(es)
                  </p>
                  <p className="font-bold">
                    Total: {(item.precio * item.cantidad).toFixed(2)} €
                  </p>
                </div>

                <button
                  onClick={() => eliminarProducto(item.referencia)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 text-xl font-bold">
            Total a pagar: {total.toFixed(2)} €
          </div>

          <button
            onClick={pagar}
            className="mt-4 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            💳 Pagar ahora
          </button>
        </>
      )}

      <a
        href="/"
        className="block mt-6 text-blue-500 hover:underline text-center"
      >
        ← Seguir comprando
      </a>
    </div>
  );
};

export default Carro;
