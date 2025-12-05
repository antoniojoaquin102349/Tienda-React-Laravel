import { loadCarritoDesdeServidor } from "../slices/carritoSlice";
import { useSelector, useDispatch } from "react-redux";
import { useState, useRef, useEffect } from "react";
import { logoutUser } from "../slices/authSlice";
import Productos from "../components/Productos";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { RootState } from "../store";
import type { Producto } from "../types";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || "Invitado";
  const [searchTerm, setSearchTerm] = useState("");
  const [carrito, setCarrito] = useState<Producto[]>([]);


  // Dropdown categorías
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleLogout = () => {
    dispatch(logoutUser());     // Limpia Redux
    localStorage.removeItem("carrito");  // Limpia carrito almacenado
    localStorage.removeItem("token");    // Por si acaso
    localStorage.removeItem("user");
    window.location.reload();   // opcional para forzar refresco del contador
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/productos?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      loadCarritoDesdeServidor(setCarrito);
    }
  }, [user]);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // Contador del carrito (opcional pero queda muy pro)
  const carritoCount = carrito.reduce((total, item) => total + item.cantidad, 0);



  return (
    <div className="w-full min-h-screen flex flex-col">
      
      {/* HEADER fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* HERO */}
      <section
        className="relative w-full h-[150vh] bg-cover bg-center flex items-center justify-start bg-[url('/fondo.JPG')]"
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-10 md:px-20 max-w-3xl">
          <h1 className="text-white text-5xl md:text-6xl font-black leading-tight drop-shadow-2xl">
            LOS MEJORES REPUESTOS 4X4
          </h1>
          <p className="text-white text-xl mt-6 font-light">
            Calidad garantizada · Envíos rápidos · Precios imbatibles
          </p>
          <Link
            to="/productos"
            className="mt-10 inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xl px-10 py-5 rounded-xl transition transform hover:scale-105"
          >
            COMPRAR AHORA
          </Link>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <div className="flex-1">
        <Productos titulo="Productos más vendidos" limit={4} />
      </div>
      
      {/* FOOTER */}
      <Footer/>    

    </div>
  );
};

export default Home;