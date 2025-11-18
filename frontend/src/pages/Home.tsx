import { useState } from "react";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { logoutUser } from "../store/authSlice";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || "Invitado";

  const handleLogout = () => dispatch(logoutUser());

  // Estado para abrir/cerrar el dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* NAVBAR */}
      <header className="w-full bg-green-700 text-white flex items-center justify-between px-6 py-3">
        {/* Saludo */}
        <div className="text-sm">Hola, {userName}</div>

        {/* Buscador */}
        <form className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Buscar por referencia o nombre..."
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
          {/* Dropdown Categorías */}
          <div className="relative"  onMouseLeave={() => setIsDropdownOpen(false)} >
            <button
              onClick={toggleDropdown}
              className="text-black hover:text-yellow-400 font-medium"
            >
              Categorías ▾
            </button>

            {isDropdownOpen && (
              <div className="absolute bg-white text-black shadow-md rounded min-w-[150px] mt-2 z-20">
                <Link className="block px-4 py-2 hover:bg-gray-100" to="/productos?cat=Carroceria">Carrocería</Link>
                <Link className="block px-4 py-2 hover:bg-gray-100" to="/productos?cat=Suspension">Suspensión</Link>
                <Link className="block px-4 py-2 hover:bg-gray-100" to="/productos?cat=Mecanica">Mecánica</Link>
                <Link className="block px-4 py-2 hover:bg-gray-100" to="/productos?cat=Ruedas">Ruedas</Link>
                <Link className="block px-4 py-2 hover:bg-gray-100" to="/productos?cat=Electricidad">Electricidad</Link>
                <Link className="block px-4 py-2 hover:bg-gray-100" to="/productos?cat=Accesorios">Accesorios</Link>
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
        style={{ backgroundImage: "url('/public/fondo.JPG')" }}
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
      <section className="py-12 px-6 md:px-12 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-8">Productos destacados</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md p-4 rounded">
            <div className="h-40 bg-gray-300"></div>
            <p className="mt-2">Referencia: ---</p>
            <p>Nombre: Producto de Ejemplo</p>
            <p>Precio: 0.00 €</p>
            <button className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Añadir al carrito
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
