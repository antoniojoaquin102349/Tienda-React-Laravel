import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom"; // Corregido: react-router-dom
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logoutUser } from "../store/authSlice";
import Productos from "../components/Productos";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || "Invitado";
  const [searchTerm, setSearchTerm] = useState("");

  // Estado del dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => dispatch(logoutUser());

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/productos?q=${encodeURIComponent(searchTerm)}`;
  };

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Alternar dropdown con clic
  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="w-full bg-green-700 text-white flex items-center justify-between px-6 py-3">
        {/* Saludo */}
        <div className="text-sm">Hola, {userName}</div>

        {/* Buscador */}
        <form className="flex items-center gap-2" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar por referencia o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 rounded-md text-black w-64"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500"
          >
            Buscar
          </button>
        </form>

        {/* NAV LINKS */}
        <nav className="flex gap-6 items-center text-sm">
          {/* Dropdown Categorías - SOLO CON CLIC */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={toggleDropdown}
              className="text-black hover:text-yellow-400 font-medium flex items-center gap-1 transition-colors"
            >
              Categorías <span className={`transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {/* Dropdown */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-48 bg-white text-black shadow-lg rounded-md overflow-hidden z-50">
                <Link
                  to="/productos?cat=Carroceria"
                  className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)} // Cierra al seleccionar
                >
                  Carrocería
                </Link>
                <Link
                  to="/productos?cat=Suspension"
                  className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Suspensión
                </Link>
                <Link
                  to="/productos?cat=Mecanica"
                  className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Mecánica
                </Link>
                <Link
                  to="/productos?cat=Ruedas"
                  className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Ruedas
                </Link>
                <Link
                  to="/productos?cat=Electricidad"
                  className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Electricidad
                </Link>
                <Link
                  to="/productos?cat=Accesorios"
                  className="block px-4 py-3 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Accesorios
                </Link>
              </div>
            )}
          </div>

          <Link to="/Cesta" className="hover:text-yellow-400">Carrito</Link>
          <Link to="/acercade" className="hover:text-yellow-400">Acerca de</Link>

          {/* Links según si está logueado */}
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400">Iniciar sesión</Link>
              <Link to="/register" className="hover:text-yellow-400">Registrate</Link>
            </>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section
        className="relative w-full h-[80vh] bg-cover bg-center flex items-center"
        style={{ backgroundImage: "url('uploads/fondo.JPG')" }} // Corregido: sin /public
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 px-10 md:px-20">
          <h1 className="text-white text-4xl md:text-5xl font-bold max-w-xl">
            ENCUENTRA LOS MEJORES REPUESTOS 4X4
          </h1>

          <Link
            to="/productos"
            className="mt-6 inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-3 rounded"
          >
            Comprar ahora
          </Link>
        </div>
      </section>

      {/* PRODUCTOS DESTACADOS */}
      <div>
        <Productos />
      </div>
    </div>
  );
};

export default Home;