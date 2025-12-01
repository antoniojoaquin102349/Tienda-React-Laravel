// src/components/Productos.tsx
import { useEffect, useState } from "react";

export interface Producto {
  id: number;
  nombre: string;
  referencia: string;
  precio: number | string;
  descripcion?: string;
  imagen?: string;
  stock?: number; // <-- stock incluido
}

// Función reutilizable para añadir al carrito
export const añadirAlCarrito = (producto: Producto) => {
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
  const existe = carrito.find((p: Producto) => p.id === producto.id);

  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
};

interface ProductosProps {
  titulo?: string;
  limit?: number;
  endpoint?: string;
  mostrarBadge?: boolean;
  columnas?: "1" | "2" | "3" | "4";
  onImagenClick?: (producto: Producto | null) => void;
}

const Productos = ({
  titulo = "Productos Destacados",
  limit = 4,
  endpoint = `http://127.0.0.1:8000/api/productos/mas-vendidos?limit=${limit}`,
  mostrarBadge = true,
  columnas = "4",
  onImagenClick,
}: ProductosProps) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [productoAñadido, setProductoAñadido] = useState<Producto | null>(null);
  const [productoModal, setProductoModal] = useState<Producto | null>(null);

  const BASE_URL = import.meta.env.VITE_APP_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [endpoint]);

  const gridCols = {
    "1": "lg:grid-cols-1",
    "2": "lg:grid-cols-2",
    "3": "lg:grid-cols-3",
    "4": "lg:grid-cols-4",
  }[columnas];

  const handleImagenClick = (producto: Producto) => {
    if (onImagenClick) {
      onImagenClick(producto);
    } else {
      setProductoModal(producto);
    }
  };

  const cerrarModal = () => {
    if (onImagenClick) {
      onImagenClick(null);
    } else {
      setProductoModal(null);
    }
  };

  const handleAñadir = (p: Producto) => {
    añadirAlCarrito(p);
    setProductoAñadido(p);
    cerrarModal();
  };

  const renderStock = (stock?: number) => {
    if (stock === undefined) return null;
    if (stock === 0) return <p className="text-red-500 font-bold">Pronto lo repondremos</p>;
    if (stock <= 5) return <p className="text-orange-500 font-semibold">Quedan {stock} unidades</p>;
    return <p className="text-green-600 font-medium">En stock: {stock}</p>;
  };

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50 text-center">
        <p className="text-xl text-gray-600">Cargando productos...</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50 relative">
      {titulo && <h2 className="text-4xl font-bold text-center mb-12">{titulo}</h2>}

      {productos.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No hay productos disponibles.</p>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-8 max-w-7xl mx-auto`}>
          {productos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="h-56 bg-gray-50 relative cursor-pointer">
                {p.imagen ? (
                  <img
                    src={`${BASE_URL}/storage/${p.imagen}`}
                    alt={p.nombre}
                    className="w-full h-full object-contain p-4 hover:scale-105 transition"
                    onClick={() => handleImagenClick(p)}
                    onError={(e) => (e.currentTarget.src = "/img/no-image.jpg")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin imagen
                  </div>
                )}
                {mostrarBadge && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    MÁS VENDIDO
                  </span>
                )}
              </div>

              <div className="p-6">
                <h3 className="font-bold text-lg line-clamp-2">{p.nombre}</h3>
                <p className="text-sm text-gray-500">Ref: {p.referencia}</p>
                <p className="text-3xl font-bold text-green-600 mt-3">
                  {Number(p.precio).toFixed(2)} €
                </p>
                {renderStock(p.stock)}

                <button
                  onClick={() => handleAñadir(p)}
                  className="mt-6 w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition"
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {productoModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={cerrarModal}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-screen overflow-y-auto p-10 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={cerrarModal}
              className="absolute top-6 right-6 text-4xl text-gray-500 hover:text-gray-800 z-10"
            >
              ×
            </button>

            <h2 className="text-4xl font-bold text-center mb-4">{productoModal.nombre}</h2>
            {productoModal.imagen && (
              <img
                src={`${BASE_URL}/storage/${productoModal.imagen}`}
                alt={productoModal.nombre}
                className="w-full h-96 object-contain rounded-2xl mb-6 bg-gray-50 mx-auto"
              />
            )}
            <div className="text-lg text-gray-700 mb-4 text-center"
              dangerouslySetInnerHTML={{ __html: productoModal.descripcion || "Sin descripción disponible." }}> 
            </div>
            <div className="text-center mb-6">{renderStock(productoModal.stock)}</div>

            <div className="flex justify-center items-center gap-12">
              <span className="text-5xl font-bold text-green-600">
                {Number(productoModal.precio).toFixed(2)} €
              </span>

              <button
                onClick={() => handleAñadir(productoModal)}
                className="px-10 py-5 bg-green-600 text-white text-2xl font-bold rounded-xl hover:bg-green-700 transition"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MENSAJE AÑADIDO AL CARRITO */}
      {productoAñadido && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">¡Añadido al carrito!</h3>
            <p className="text-lg text-gray-700 mb-8">
              <strong className="text-green-600">{productoAñadido.nombre}</strong>
              <br />
              se ha añadido correctamente
            </p>

            <div className="flex flex-col gap-4">
              <a
                href="/cesta"
                className="block w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition"
              >
                Ver carrito
              </a>
              <button
                onClick={() => setProductoAñadido(null)}
                className="w-full py-4 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Productos;
