// src/pages/ListaProductos.tsx

import { useLocation, Link } from "react-router-dom";
import Productos from "../components/Productos";

const ListaProductos = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const q = params.get("q") || "";
  const cat = params.get("cat") || "";

  let url = "http://127.0.0.1:8000/api/productos/buscar";
  const searchParams = new URLSearchParams();
  if (q) searchParams.set("q", q);
  if (cat) searchParams.set("cat", cat);
  if (searchParams.toString()) url += `?${searchParams.toString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="py-10 text-center bg-white shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">
          {q ? `Resultados para: "${q}"` : "Todos los productos"}
        </h1>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-600 transition"
        >
          ← Volver al inicio
        </Link>
      </div>

      <Productos
        titulo=""
        endpoint={url}
        mostrarBadge={false}
        columnas="3"
        // No necesitas pasar onImagenClick → el componente ya lo gestiona solo
      />
    </div>
  );
};

export default ListaProductos;