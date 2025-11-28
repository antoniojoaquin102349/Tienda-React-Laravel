import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MensajeModal from "../components/MensajeModal";

interface ProductoCarrito {
  id: number;
  nombre: string;
  referencia: string;
  precio: number | string;
  cantidad: number;
  imagen?: string;
}

const Cesta = () => {
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);
  const [mostrarModalConfirmarVaciado, setMostrarModalConfirmarVaciado] = useState(false);
  const [mostrarModalCarritoVacio, setMostrarModalCarritoVacio] = useState(false);

  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_APP_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) {
      const parsed = JSON.parse(data);
      const fixed = parsed.map((item: any) => ({
        ...item,
        precio: parseFloat(item.precio) || 0
      }));
      setCarrito(fixed);
    }
  }, []);

  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
      localStorage.removeItem("carrito");
    }
  }, [carrito]);

  const precioNum = (precio: number | string) => parseFloat(String(precio)) || 0;

  const actualizarCantidad = (id: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 1) return;
    setCarrito(prev =>
      prev.map(item =>
        item.id === id ? { ...item, cantidad: nuevaCantidad } : item
      )
    );
  };

  const eliminarProducto = (id: number) => {
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    setCarrito(nuevoCarrito);

    if (nuevoCarrito.length === 0) {
      setMostrarModalCarritoVacio(true);
      setTimeout(() => navigate("/"), 2500);
    }
  };

  const vaciarCarrito = () => {
    setMostrarModalConfirmarVaciado(true);
  };

  const confirmarVaciado = () => {
    setCarrito([]);
    setMostrarModalConfirmarVaciado(false);
    setMostrarModalCarritoVacio(true);
    setTimeout(() => navigate("/"), 2500);
  };

  const cancelarVaciado = () => {
    setMostrarModalConfirmarVaciado(false);
  };

  const total = carrito.reduce(
    (acc, item) => acc + precioNum(item.precio) * item.cantidad,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-12">Tu Carrito</h1>

        <div className="space-y-6">
          {carrito.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6"
            >
              <img
                src={
                  item.imagen
                    ? `${BASE_URL}/storage/${item.imagen}`
                    : "/img/no-image.jpg"
                }
                alt={item.nombre}
                className="w-32 h-32 object-contain rounded-xl bg-gray-50 p-4 shadow"
                onError={e => (e.currentTarget.src = "/img/no-image.jpg")}
              />

              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold">{item.nombre}</h3>
                <p className="text-gray-600">Ref: {item.referencia}</p>
                <p className="text-xl font-semibold text-green-600">
                  {precioNum(item.precio).toFixed(2)} € / ud.
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                  className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full text-2xl font-bold"
                >
                  −
                </button>

                <input
                  type="number"
                  value={item.cantidad}
                  onChange={e =>
                    actualizarCantidad(
                      item.id,
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="w-20 text-center text-xl font-bold border-2 rounded-lg py-2"
                  min="1"
                  placeholder="Cantidad"
                  title="Cantidad de producto"
                />

                <button
                  onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                  className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full text-2xl font-bold"
                >
                  +
                </button>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold">
                  {(precioNum(item.precio) * item.cantidad).toFixed(2)} €
                </p>
                <button
                  onClick={() => eliminarProducto(item.id)}
                  className="mt-2 text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 text-right">
          <button
            onClick={vaciarCarrito}
            className="text-red-600 mb-4 block"
          >
            Vaciar carrito
          </button>

          <p className="text-4xl font-bold">
            Total: <span className="text-green-600">{total.toFixed(2)} €</span>
          </p>

          <div className="mt-8 flex justify-end gap-6">
            <Link
              to="/"
              className="px-8 py-4 bg-gray-300 rounded-xl font-bold hover:bg-gray-400"
            >
              Seguir comprando
            </Link>
            <Link
              to="/checkout"
              className="px-12 py-5 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700"
            >
              Confirmar y Pagar
            </Link>
          </div>
        </div>
      </div>

      {/* Modales manejados por el componente MensajeModal */}
        <MensajeModal
          isOpen={mostrarModalConfirmarVaciado}
          onClose={cancelarVaciado}
          titulo="Vaciar carrito"
          mensaje="¿Seguro que deseas vaciar todo el carrito?"
          mostrarBotones={true}
          textoBotonPrimario="Vaciar"
          textoBotonSecundario="Cancelar"
          onConfirmar={confirmarVaciado}
        />

        <MensajeModal
          isOpen={mostrarModalCarritoVacio}
          onClose={() => setMostrarModalCarritoVacio(false)}
          titulo="Carrito "
          mensaje="Tu carrito está vacío."
        />
    </div>
  );
};

export default Cesta;