import { ShoppingCart, LogOut, User } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Link } from "react-router-dom";

export default function Header() {
  const { user, logout, cart, loginWithGoogle } = useApp();

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            MiTienda
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link to="/cart" className="relative">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link to="/purchases" className="hidden sm:block text-gray-700">
                  Mis compras
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-gray-700 hover:text-indigo-600"
                >
                  <User className="w-5 h-5" />
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Iniciar con Google
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}