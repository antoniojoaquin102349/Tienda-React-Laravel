import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logoutUser } from "../store/authSlice";
import Productos from "../components/Productos";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || "Invitado";
  const [searchTerm, setSearchTerm] = useState("");

  // Dropdown categorías
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => dispatch(logoutUser());

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

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  // Contador del carrito (opcional pero queda muy pro)
  const carritoCount = (() => {
    const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
    return carrito.reduce((total: number, item: any) => total + item.cantidad, 0);
  })();

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="w-full bg-green-700 text-black flex items-center justify-between px-6 py-4 shadow-lg">
        <div className="text-sm font-medium">Hola, {userName}</div>

        <form className="flex items-center gap-3" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar por referencia o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg text-black w-72 focus:outline-none focus:outline-yellow-400"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-500 transition"
          >
            Buscar
          </button>
        </form>

        <nav className="flex items-center gap-8 text-sm font-medium">
          {/* Dropdown Categorías */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="flex items-center gap-1 hover:text-yellow-300 transition"
            >
              Categorías ▼
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-52 bg-white text-black rounded-lg shadow-2xl overflow-hidden z-50">
                {["Carrocería", "Suspensión", "Mecánica", "Ruedas", "Electricidad", "Accesorios"].map(cat => (
                  <Link
                    key={cat}
                    to={`/productos?cat=${encodeURIComponent(cat)}`}
                    className="block px-5 py-3 hover:bg-gray-100 transition"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Carrito con contador */}
          <Link to="/cesta" className="relative hover:text-yellow-300 transition">
            Carrito
            {carritoCount > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {carritoCount}
              </span>
            )}
          </Link>

          {/* Historial de pedidos (solo si está logueado) */}
          {user && (
            <Link to="/historialpedidos" className="hover:text-yellow-300 transition">
              Mis Pedidos
            </Link>
          )}

          <Link to="/acercade" className="hover:text-yellow-300 transition">
            Acerca de
          </Link>

          {/* Login / Logout */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-300 transition">
                Iniciar sesión
              </Link>
              <Link to="/register" className="hover:text-yellow-300 transition">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section
        className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-start"
        style={{ backgroundImage: "url('/fondo.JPG')" }}
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
    </div>
  );
};

export default Home;