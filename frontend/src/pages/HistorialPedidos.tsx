import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type {Producto, Pedido} from "../types";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";


const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_APP_URL || "http://127.0.0.1:8000";
  const [_modalLogin, setModalLogin] = useState(false);

  const [modalDevolucionOpen, setModalDevolucionOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [motivo, setMotivo] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");



  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Abrir modal
      setModalLogin(true);

      // Redirigir después de 2.5s (igual que autoCerrarMs)
      setTimeout(() => {
        navigate("/login");
      }, 2000);

      return;
    }

    axios
      .get(`${BASE_URL}/api/mis-pedidos`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const pedidosRaw = res.data.pedidos || [];
        const pedidosConTotalNumero = pedidosRaw.map((p: Pedido) => ({
          ...p,
          total: Number(p.total) || 0,
          productos: p.productos.map((prod) => ({
            ...prod,
            precio: Number(prod.precio) || 0,
            cantidad: Number(prod.cantidad) || 0, 
          })),
        }));

        // 🔹 Ordenar de más reciente a más antiguo
      pedidosConTotalNumero.sort((a: Pedido, b: Pedido) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // =================== AÑADE ESTO AQUÍ ===================
        console.log("PEDIDOS RECIBIDOS DEL SERVIDOR:", pedidosConTotalNumero);


        setPedidos(pedidosConTotalNumero);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);

        if (err.response?.status === 401) {
          setError("Sesión expirada. Serás redirigido al inicio...");
          localStorage.removeItem("token");
          setTimeout(() => navigate("/"), 2000);
        } else if (err.response?.status === 404) {
          setError("No se encontró el recurso de pedidos. Verifica la URL de la API.");
        } else {
          setError("Error cargando pedidos: " + err.message);
        }

        console.error("Error cargando pedidos:", err);
      });
  }, [BASE_URL, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-2xl text-gray-600">Cargando tus pedidos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-xl shadow-lg text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-2xl font-bold text-gray-800">{error}</p>
          {error.includes("Sesión expirada") && (
            <p className="text-lg text-gray-600 mt-2">Redirigiéndote al inicio...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-gray-50">

      {/* HEADER fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      <div className="max-w-6xl mx-auto mt-10">
        <h1 className="text-5xl font-bold text-center mb-12 text-gray-800">Mis Pedidos</h1>

        {pedidos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <p className="text-2xl text-gray-600 mb-6">Aún no has realizado ningún pedido</p>
            <a
              href="/"
              className="inline-block px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 transition"
            >
              Ir a la tienda
            </a>
          </div>
        ) : (
          <div className="space-y-10">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Pedido #{pedido.id}</h2>
                    <p className="text-md bg-white text-green-700 px-4 py-1 rounded-lg font-bold shadow">
                      Estado: {pedido.estado ?? "pendiente"}
                    </p>
                     {pedido.estado === "enviado" &&
                        pedido.envios_enviados &&
                        pedido.envios_enviados.length > 0 && (
                          <div className="mt-2 text-black">

                            <p className="text-gray-700">
                              <span className="font-semibold">Transportista: </span>
                              {pedido.envios_enviados[0].transportista ?? "No disponible"}
                            </p>

                            <p className="text-gray-700">
                              <span className="font-semibold">Número de seguimiento: </span>
                              {pedido.envios_enviados[0].numero_seguimiento ?? "No asignado"}
                            </p>

                          </div>
                      )}

                    <div className="text-right">
                      <p className="text-lg opacity-90">
                        {new Date(pedido.created_at).toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-3xl font-bold mt-2">{pedido.total.toFixed(2)} €</p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {pedido.productos.map((prod, i) => (
                      <div
                        key={i}
                        className="flex flex-col lg:flex-row gap-6 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                      >

                        <div className="w-full lg:w-48 flex-shrink-0">
                          {prod.imagen && prod.imagen.toString().trim() !== "" ? (
                            <img
                              src={`${BASE_URL}/storage/${prod.imagen}`}
                              alt={prod.nombre}
                              className="w-full h-56 object-contain p-4 rounded-lg bg-gray-50"
                              onError={(e) => {
                                console.error(`Error cargando imagen "${prod.imagen}"`);
                                e.currentTarget.src = "/img/no-image.jpg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-56 flex items-center justify-center bg-gray-200 rounded-lg">
                              <span className="text-gray-500 text-sm text-center">Sin imagen</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{prod.nombre}</h3>
                          {prod.referencia && (
                            <p className="text-sm text-gray-500 mb-4">Ref: {prod.referencia}</p>
                          )}
                          <div className="flex items-center justify-between sm:justify-start sm:gap-8">
                            <div className="text-lg">
                              <p className="text-sm text-gray-600">Cantidad</p>
                              <p className="font-semibold text-gray-900">{prod.cantidad}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Precio unitario</p>
                              <p className="text-2xl font-bold text-green-600">{prod.precio.toFixed(2)} €</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Subtotal</p>
                              <p className="text-xl font-bold text-gray-900">
                                {(prod.cantidad * prod.precio).toFixed(2)} €
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {pedido.estado === "entregado" && (
                  <div className="mt-8 text-right">
                    <button
                      className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                      onClick={() => {
                        setPedidoSeleccionado(pedido);
                        setModalDevolucionOpen(true);
                      }}
                    >
                      Devolver producto
                    </button>
                  </div>
                )}

                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-16">
          <a
            href="/"
            className="inline-block px-10 py-4 bg-yellow-500 text-black font-bold text-xl rounded-xl hover:bg-yellow-600 transition transform hover:scale-105"
          >
            Seguir comprando
          </a>
        </div>
      </div>
      {/* FOOTER */}
      <Footer/>  
      
        {/*ELIGES LA OPCION DE LA DEVOLUCIÓN*/}
        {modalDevolucionOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                Motivo de la devolución
              </h2>

              <label htmlFor="motivoDevolucion" className="sr-only">
                Motivo de devolución
              </label>
              <select
                id="motivoDevolucion"
                name="motivoDevolucion"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="border px-3 py-2 rounded mt-1 w-full"
              >
                <option value="">Selecciona un motivo</option>
                <option value="defectuoso">Producto defectuoso</option>
                <option value="equivocado">Producto equivocado</option>
                <option value="noGusta">No me gusta</option>
              </select>


              <div className="flex justify-between">
                <button
                  className="px-6 py-3 bg-gray-400 text-white rounded-xl hover:bg-gray-500"
                  onClick={() => setModalDevolucionOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                  onClick={async () => {
                    if (!motivo || !pedidoSeleccionado) return;

                    const token = localStorage.getItem("token");
                    try {
                      await axios.post(
                        `${BASE_URL}/api/devolver-producto`,
                        {
                          pedido_id: pedidoSeleccionado.id,
                          motivo,
                        },
                        {
                          headers: { Authorization: `Bearer ${token}` }
                        }
                      );

                      setMensajeExito("Solicitud de devolución enviada correctamente.");
                      setModalDevolucionOpen(false);

                      setTimeout(() => setMensajeExito(""), 2500);
                    } catch (err) {
                      console.error("Error al enviar devolución:", err);
                    }
                  }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        )}
                      
    </div>
  );
};

export default HistorialPedidos;
