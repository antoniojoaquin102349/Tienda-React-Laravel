import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="font-bold text-xl">Tienda 4x4</div>
      <ul className="flex gap-4">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/purchases">Mis Compras</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}
