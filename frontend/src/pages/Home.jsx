import { useEffect, useState } from "react";
import api from "../api/api";
import { Product } from "../types";
import { useApp } from "../context/AppContext";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useApp();

  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data.data || res.data);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition"
          >
            <img
              src={p.image}
              alt={p.title}
              className="w-full h-64 object-contain p-4"
            />
            <div className="p-4">
              <h3 className="font-semibold line-clamp-2">{p.title}</h3>
              <p className="text-2xl font-bold text-indigo-600 mt-2">
                ${p.price.toFixed(2)}
              </p>
              <button
                onClick={() => addToCart(p)}
                className="mt-4 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}