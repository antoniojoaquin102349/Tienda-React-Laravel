import React from 'react';
import { useAppContext } from '../context/AppContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useAppContext();

  return (
    <div className="border p-4 rounded shadow hover:shadow-lg transition">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover"/>
      <h2 className="text-lg font-bold mt-2">{product.name}</h2>
      <p className="text-blue-600 font-semibold">${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Añadir al carrito
      </button>
    </div>
  );
};

export default ProductCard;
