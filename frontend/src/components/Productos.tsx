// src/components/Productos.tsx

import { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
  referencia: string;
  precio: number;
  descripcion?: string;
  imagen?: string;
}

// Función reutilizable del carrito
export const añadirAlCarrito = (producto: Producto) => {
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
  const existe = carrito.find((p: any) => p.id === producto.id);

  if (existe) {
    existe.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${producto.nombre} añadido al carrito!`);
};

interface ProductosProps {
  titulo?: string;
  limit?: number;
  endpoint?: string;
  mostrarBadge?: boolean;
  columnas?: "1" | "2" | "3" | "4";
  /** Nueva prop: función que se ejecuta al hacer clic en la imagen */
  onImagenClick?: (producto: Producto) => void;
}

const Productos = ({
  titulo = "Productos Destacados",
  limit = 4,
  endpoint = `http://127.0.0.1:8000/api/productos/mas-vendidos?limit=${limit}`,
  mostrarBadge = true,
  columnas = "4",
  onImagenClick,
}: ProductosProps = {}) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando productos:", err);
        setLoading(false);
      });
  }, [endpoint]);

  const gridCols = {
    "1": "lg:grid-cols-1",
    "2": "lg:grid-cols-2",
    "3": "lg:grid-cols-3",
    "4": "lg:grid-cols-4",
  }[columnas];

  if (loading) {
    return (
      <section className="py-16 px-6 bg-gray-50">
        <p className="text-center text-gray-600">Cargando {titulo.toLowerCase()}...</p>
      </section>
    );
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-gray-50">
      {titulo && (
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          {titulo}
        </h2>
      )}

      {productos.length === 0 ? (
        <p className="text-center text-gray-500">No hay productos disponibles.</p>
      ) : (
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-8 max-w-7xl mx-auto`}>
          {productos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="h-56 bg-gray-100 relative overflow-hidden">
                {p.imagen ? (
                  <img
                    src={p.imagen}
                    alt={p.nombre}
                    className="w-full h-full object-contain p-4 cursor-pointer"
                    onClick={() => onImagenClick?.(p)} // AQUÍ se abre el modal si está definido
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Sin imagen
                  </div>
                )}
                {mostrarBadge && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    MÁS VENDIDO
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 truncate">{p.nombre}</h3>
                <p className="text-sm text-gray-500">Ref: {p.referencia}</p>
                <p className="text-2xl font-bold text-green-600 mt-3">
                  {Number(p.precio).toFixed(2)} €
                </p>

                <button
                  onClick={() => añadirAlCarrito(p)}
                  className="mt-5 w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Añadir al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Productos;