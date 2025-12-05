// src/pages/ListaProductos.tsx
import { useLocation, Link } from "react-router-dom";
import Productos from "../components/Productos";
import Header from "../components/Header";
import Footer from "../components/Footer";


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
      
      {/* HEADER fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* Contenido principal */}
      <div className="py-10 text-center bg-white shadow-sm mt-15">
        <h1 className="text-3xl font-bold text-gray-800">
          {q ? `Resultados para: "${q}"` : "Todos los productos"}
        </h1>
      </div>

      <Productos
        titulo=""
        endpoint={url}
        mostrarBadge={false}
        columnas="3"
      />
      
      {/* FOOTER */}
      <Footer/>
      
    </div>
  );
};

export default ListaProductos;