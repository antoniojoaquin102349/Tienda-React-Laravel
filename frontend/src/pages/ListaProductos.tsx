// src/pages/ListaProductos.tsx  (o donde lo tengas)

import { useLocation, Link } from "react-router-dom";
import Productos, { añadirAlCarrito } from "../components/Productos";
import { useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  referencia: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
}

const ListaProductos = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";
  const cat = params.get("cat") || "";

  const [productoModal, setProductoModal] = useState<Producto | null>(null);

  // Construimos la URL de búsqueda
  let url = "http://127.0.0.1:8000/api/productos/buscar";
  const searchParams = new URLSearchParams();
  if (q) searchParams.set("q", q);
  if (cat) searchParams.set("cat", cat);
  if (searchParams.toString()) url += `?${searchParams.toString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Encabezado */}
      <div className="py-10 text-center bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">
          {q ? `Resultados para: "${q}"` : "Todos los productos"}
        </h1>
        <Link
          to="/" className="mt-6 inline-block px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition">
          ← Volver al inicio
        </Link>
      </div>

      {/* Lista reutilizando el componente */}
      <Productos
        titulo="" // sin título porque ya lo tenemos arriba
        endpoint={url}
        mostrarBadge={false}
        columnas="3"
        onImagenClick={setProductoModal} // abre el modal
      />

      {/* Modal bonito */}
      {productoModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setProductoModal(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setProductoModal(null)}
              className="absolute top-4 right-4 text-4xl text-gray-400 hover:text-gray-700"
            >
              ×
            </button>

            <h2 className="text-3xl font-bold mb-6">{productoModal.nombre}</h2>

            {productoModal.imagen && (
              <img
                src={productoModal.imagen}
                alt={productoModal.nombre}
                className="w-full h-96 object-contain rounded-xl mb-6 bg-gray-50"
              />
            )}

            <p className="text-gray-700 mb-8 leading-relaxed">
              {productoModal.descripcion || "Sin descripción disponible."}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-4xl font-bold text-green-600">
                {Number(productoModal.precio).toFixed(2)} €
              </span>
              <button
                onClick={() => {
                  añadirAlCarrito(productoModal);
                  setProductoModal(null);
                }}
                className="px-8 py-4 bg-green-600 text-white text-xl font-bold rounded-xl hover:bg-green-700 transition"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaProductos;