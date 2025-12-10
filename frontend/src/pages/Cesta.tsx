import MensajeModal from "../components/MensajeModal";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import {
  cargarCarrito,
  agregarProducto,
  actualizarCantidad,
  vaciarCarritoServidor,
  eliminarProducto,
  setItems,
} from "../slices/carritoSlice";
import type { Producto } from "../types";

const Cesta = () => {
  const dispatch = useDispatch<AppDispatch>();
  const carritoItems = useSelector((state: RootState) => state.carrito.items);
  const [mostrarModalConfirmarVaciado, setMostrarModalConfirmarVaciado] = useState(false);
  const [mostrarModalCarritoVacio, setMostrarModalCarritoVacio] = useState(false);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_APP_URL || "http://127.0.0.1:8000";

  // Cargar carrito al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(cargarCarrito());
    } else {
      const data = localStorage.getItem("carrito");
      if (data) {
        const carrito: Producto[] = JSON.parse(data);
        dispatch(setItems(carrito));
      }
    }
  }, [dispatch]);

  const precioNum = (precio: number | string) => parseFloat(String(precio)) || 0;

  const handleActualizarCantidad = (id: number, cantidad: number) => {
    if (cantidad < 1) return;
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(actualizarCantidad({ id, cantidad }));
    } else {
      const data = localStorage.getItem("carrito");
      if (!data) return;
      const carrito: Producto[] = JSON.parse(data);
      const item = carrito.find(p => p.id === id);
      if (item) item.cantidad = cantidad;
      localStorage.setItem("carrito", JSON.stringify(carrito));
      dispatch(setItems(carrito));
    }
  };

  const handleEliminarProducto = (id: number) => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(eliminarProducto(id));
    } else {
      const data = localStorage.getItem("carrito");
      if (!data) return;

      // Parseamos y tipamos correctamente
      const carritoData: Producto[] = JSON.parse(data) as Producto[];

      // Filtramos el producto a eliminar
      const carrito = carritoData.filter(p => p.id !== id);

      // Guardamos el carrito actualizado en localStorage
      localStorage.setItem("carrito", JSON.stringify(carrito));

      // Opcional: actualizar Redux para que la UI refleje el cambio
      dispatch(setItems(carrito));

    }

    if (carritoItems.length === 1) {
      setMostrarModalCarritoVacio(true);
      setTimeout(() => navigate("/"), 1500);
    }

  };

  const handleVaciarCarrito = () => {
    setMostrarModalConfirmarVaciado(true);
  };

  const confirmarVaciado = () => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(vaciarCarritoServidor());
    }
    localStorage.removeItem("carrito");
    dispatch(setItems([]));
    setMostrarModalConfirmarVaciado(false);
    setMostrarModalCarritoVacio(true);
    navigate("/", { replace: true });
  };

  const cancelarVaciado = () => setMostrarModalConfirmarVaciado(false);

  const total = carritoItems.reduce(
    (acc, item) => acc + precioNum(item.precio) * item.cantidad,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="max-w-6xl mx-auto mt-10">
        <h1 className="text-5xl font-bold text-center mb-12">Tu Carrito</h1>

        {carritoItems.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">Tu carrito está vacío.</p>
        ) : (
          <div className="space-y-6">
            {carritoItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-center gap-6"
              >
                <img
                  src={item.imagen ? `${BASE_URL}/storage/${item.imagen}` : "/img/no-image.jpg"}
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
                    onClick={() => handleActualizarCantidad(item.id, item.cantidad - 1)}
                    className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full text-2xl font-bold"
                  >
                    −
                  </button>

                  <input
                    type="number"
                    value={item.cantidad}
                    onChange={e => handleActualizarCantidad(item.id, parseInt(e.target.value) || 1)}
                    className="w-20 text-center text-xl font-bold border-2 rounded-lg py-2"
                    min="1"
                    placeholder="Cantidad"
                    title="Cantidad de producto"
                  />
                  
                  <button
                    onClick={() => handleActualizarCantidad(item.id, item.cantidad + 1)}
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
                    onClick={() => handleEliminarProducto(item.id)}
                    className="mt-2 text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 text-right">
          <button onClick={handleVaciarCarrito} className="text-red-600 mb-4 block">
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

      <MensajeModal
        isOpen={mostrarModalCarritoVacio}
        onClose={() => setMostrarModalCarritoVacio(false)}
        titulo="Carrito"
        mensaje="Tu carrito está vacío."
        mostrarCerrar={false}
        autoCerrarMs={1500}
      />

      <MensajeModal
        isOpen={mostrarModalConfirmarVaciado}
        onClose={cancelarVaciado}
        titulo="Vaciar carrito"
        mensaje="¿Seguro que deseas vaciar todo el carrito?"
        mostrarBotones={true}
        mostrarCerrar={false}
        textoBotonPrimario="Vaciar"
        textoBotonSecundario="Cancelar"
        onConfirmar={confirmarVaciado}
      />

      <Footer />
    </div>
  );
};

export default Cesta;
