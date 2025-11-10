import React from "react";

export default function Home() {
  return (
    <div className="p-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
        <img
          src="/images/tire.jpg"
          alt="Neumático"
          className="w-full h-40 object-cover rounded"
        />
        <h2 className="font-bold mt-2">Neumático 4x4</h2>
        <p className="text-gray-600">$200</p>
        <button className="mt-2 bg-red-500 text-white px-4 py-2 rounded w-full">
          Agregar al carrito
        </button>
      </div>
      {/* Agrega más productos aquí */}
    </div>
  );
}
