import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { cart } = useAppContext();
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link to="/" className="font-bold text-lg">Tienda 4x4</Link>
        <Link to="/purchases" className="hover:text-gray-300">Mis Compras</Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link to="/checkout" className="hover:text-gray-300">
          Carrito ({cart.length})
        </Link>
        {user ? (
          <>
            <span>{user.name}</span>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Salir</button>
          </>
        ) : (
          <Link to="/login" className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
