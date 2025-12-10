import { cargarCarrito, reset } from "../slices/carritoSlice";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { logoutUser } from "../slices/authSlice";
import { persistor } from "../store";


const Header = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const carritoItems = useSelector((state: RootState) => state.carrito.items);
  const carritoCount = carritoItems.reduce((total, item) => total + item.cantidad, 0);

  const userName = user?.name || "Invitado";

  const [searchTerm, setSearchTerm] = useState("");
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const categoriasRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<HTMLDivElement>(null);

  // Cerrar sesión
  const handleLogout = () => {
    // Limpiar usuario en Redux
    dispatch(logoutUser());

    // Limpiar carrito en Redux
    dispatch(reset());

    // 🔥 Limpiar redux-persist (usuario + carrito)
    persistor.purge();

    // Limpiar token manualmente
    localStorage.removeItem("token");
  };


  // Buscar productos
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/productos?q=${encodeURIComponent(searchTerm.trim())}`;
    }
  };

  // Click fuera de dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoriasRef.current && !categoriasRef.current.contains(e.target as Node)) {
        setIsCategoriasOpen(false);
      }
      if (configRef.current && !configRef.current.contains(e.target as Node)) {
        setIsConfigOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cargar carrito al iniciar sesión
  useEffect(() => {
    if (token) dispatch(cargarCarrito());
  }, [token, dispatch]);

  const categorias = ["Carrocería", "Suspensión", "Mecánica", "Ruedas", "Electricidad", "Accesorios"];

  return (
    <header className="w-full bg-green-700 text-black flex items-center justify-between px-6 py-4 shadow-lg">
      <div className="text-sm font-medium">Hola, {userName}</div>

      {/* Buscador */}
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

      {/* Navegación */}
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
              {categorias.map((cat) => (
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

        {/* Configuración */}
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
                <Link to="/historialpedidos" className="block px-5 py-3 hover:bg-gray-100 transition">
                  Mis Pedidos
                </Link>
                <Link to="/datos" className="block px-5 py-3 hover:bg-gray-100 transition">
                  Mis Datos
                </Link>
              </div>
            )}
          </div>
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
            {location.pathname !== "/login" && (
              <Link to="/login" className="hover:text-yellow-300 transition">
                Iniciar sesión
              </Link>
            )}
            {location.pathname !== "/register" && (
              <Link to="/register" className="hover:text-yellow-300 transition">
                Registrarse
              </Link>
            )}
          </>
        )}

        {/* Botón inicio */}
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
