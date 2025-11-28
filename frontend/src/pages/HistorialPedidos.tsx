import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Producto {
  nombre: string;
  precio: number;
  cantidad: number;
  imagen?: string;
}

interface Pedido {
  id: number;
  total: number;
  created_at: string;
  productos: Producto[];
}

const HistorialPedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_APP_URL || "http://127.0.0.1:8000";
  const [_modalLogin, setModalLogin] = useState(false);


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
        const pedidosConTotalNumero = res.data.map((p: Pedido) => ({
          ...p,
          total: Number(p.total) || 0,
          productos: p.productos.map((prod) => ({
            ...prod,
            precio: Number(prod.precio) || 0,
          })),
        }));

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
      <div className="max-w-6xl mx-auto">
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
                <div className="_bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Pedido #{pedido.id}</h2>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {pedido.productos.map((prod, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 bg-gray-50 p-5 rounded-xl hover:bg-gray-100 transition"
                      >
                        <div className="w-28 h-28 _flex-shrink-0 relative">
                          {prod.imagen && prod.imagen.toString().trim() !== "" ? (
                            <img
                              src={`${BASE_URL}/storage/${prod.imagen}`}
                              alt={prod.nombre}
                              className="w-full h-full object-contain p-2 rounded-lg"
                              onError={(e) => {
                                console.error(`Error cargando imagen "${prod.imagen}"`);
                                e.currentTarget.src = "/img/no-image.jpg";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                              <span className="text-gray-500 text-xs text-center">Sin imagen</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 line-clamp-2">{prod.nombre}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Cantidad: {prod.cantidad} × {prod.precio.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
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
    </div>
  );
};

export default HistorialPedidos;