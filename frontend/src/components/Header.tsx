// src/components/Header.tsx
import { loadCarritoDesdeServidor } from "../slices/carritoSlice";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { logoutUser } from "../slices/authSlice";
import type { RootState } from "../store";
import type { Producto } from "../types";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || "Invitado";
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const carritoCount = carrito.reduce((t, i) => t + i.cantidad, 0);

  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const categoriasRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<HTMLDivElement>(null);
  
  

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("carrito");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/productos?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Cerrar Categorías si clic fuera
      if (categoriasRef.current && !categoriasRef.current.contains(e.target as Node)) {
        setIsCategoriasOpen(false);
      }
      // Cerrar Configuración si clic fuera
      if (configRef.current && !configRef.current.contains(e.target as Node)) {
        setIsConfigOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user)
      loadCarritoDesdeServidor(setCarrito);
  }, [user]);

  return (
    <header className="w-full bg-green-700 text-black flex items-center justify-between px-6 py-4 shadow-lg">
      <div className="text-sm font-medium">Hola, {userName}</div>

      {/* BUSCADOR */}
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

      {/* NAV */}
      <nav className="flex items-center gap-8 text-sm font-medium">
        {/* Categorías */}
        <div className="relative" ref={categoriasRef}>
          <button
            type="button"
            onClick={() => setIsCategoriasOpen(!isCategoriasOpen)}
            className="flex items-center gap-1 hover:text-yellow-300 transition"
          >
            Categorías ▼
          </button>

          {isCategoriasOpen && (
            <div className="absolute left-0 top-full mt-2 w-52 bg-white text-black rounded-lg shadow-2xl overflow-hidden z-50">
              {["Carrocería", "Suspensión", "Mecánica", "Ruedas", "Electricidad", "Accesorios"].map(cat => (
                <Link
                  key={cat}
                  to={`/productos?cat=${encodeURIComponent(cat)}`}
                  className="block px-5 py-3 hover:bg-gray-100 transition"
                  onClick={() => setIsCategoriasOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Carrito */}
        <Link to="/cesta" className="relative hover:text-yellow-300 transition">
          Carrito
          {carritoCount > 0 && (
            <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
              {carritoCount}
            </span>
          )}
        </Link>

        {/* CONFIGURACIÓN */}
        {user && (
          <div className="relative" ref={configRef}>
            <button
              type="button"
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="flex items-center gap-1 hover:text-yellow-300 transition"
            >
              Configuración ▼
            </button>

            {isConfigOpen && (
              <div className="absolute left-0 top-full mt-2 w-52 bg-white text-black rounded-lg shadow-2xl overflow-hidden z-50">
                <Link
                  to="/historialpedidos"
                  className="block px-5 py-3 hover:bg-gray-100 transition"
                  onClick={() => setIsConfigOpen(false)}
                >
                  Mis Pedidos
                </Link>
                <Link
                  to="/datos"
                  className="block px-5 py-3 hover:bg-gray-100 transition"
                  onClick={() => setIsConfigOpen(false)}
                >
                  Mis Datos
                </Link>
              </div>
            )}
          </div>
        )}

        <Link to="/acercade" className="hover:text-yellow-300 transition">
          Acerca de
        </Link>

        {/* LOGIN / LOGOUT */}
        {user ? (
          <button
            onClick={handleLogout}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-medium"
          >
            Cerrar sesión
          </button>
        ) : (
          <>
            {/* Mostrar "Iniciar sesión" solo si no estamos en /login */}
            {location.pathname !== "/login" && (
              <Link to="/login" className="hover:text-yellow-300 transition">
                Iniciar sesión
              </Link>
            )}

            {/* Mostrar "Registrarse" solo si no estamos en /register */}
            {location.pathname !== "/register" && (
              <Link to="/register" className="hover:text-yellow-300 transition">
                Registrarse
              </Link>
            )}
          </>
        )}

        {/* Botón Inicio visible solo si NO estamos en "/" */}
        {location.pathname !== "/" && (
          <Link
            to="/"
            className="px-4 py-2 bg-yellow-400 text-black rounded-lg font-medium hover:bg-yellow-500 transition"
          >
            Inicio
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
