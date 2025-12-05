import { authHeaders } from "../services/Api";
import type { Producto} from "../types";

const BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost:8000"; // ajusta según tu backend

// 👉 Añade un producto al carrito del usuario en el servidor
export const agregarProductoServidor = async (productoId: number, cantidad: number) => {
  const token = localStorage.getItem('token');

  const response = await fetch('http://127.0.0.1:8000/api/carrito', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ producto_id: productoId, cantidad })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("ERROR DEL SERVIDOR:", text);
    throw new Error('Error al agregar producto al carrito en el servidor');
  }

  return response.json();
};


// 👉 Sincroniza el carrito con el servidor (solo si hay token válido)
export const syncCarritoConServidor = async (cart: Producto[]) => {
  const token = localStorage.getItem("token");
  if (!token || token.trim() === "") return;

  try {
    const response = await fetch(`${BASE_URL}/api/carrito/sync`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ cart }),
    });

    if (!response.ok) {
      console.error("Error sincronizando carrito:", response.statusText);
    } else {
      console.log("Carrito sincronizado correctamente con servidor");
    }
  } catch (err) {
    console.error("Error sincronizando carrito:", err);
  }
};


// 👉 Carga el carrito desde el servidor (solo si hay token válido)
export const loadCarritoDesdeServidor = async (
  setCarrito: (c: Producto[]) => void
) => {
  const token = localStorage.getItem("token");
  if (!token || token.trim() === "") return; // no cargar si no hay sesión

  try {
    const response = await fetch(`${BASE_URL}/api/carrito`, {
      headers: authHeaders(),
    });

    if (!response.ok) {
      console.error("Error al cargar carrito:", response.statusText);
      return;
    }

    const serverCart = await response.json();
    console.log("Respuesta cruda del servidor:", serverCart);

    // Manejar si la API devuelve { carritpo: [...] } o directamente un array
    const items = Array.isArray(serverCart)
      ? serverCart
      : serverCart.carrito || serverCart.cart || [];

    if (items.length > 0) {
      const mapped: Producto[] = items.map((i: any) => ({
        id: i.id,
        nombre: i.nombre,
        referencia: i.referencia,
        precio: parseFloat(i.precio),
        cantidad: i.cantidad,
        imagen: i.imagen,
      }));

      setCarrito(mapped);
      console.log("Carrito cargado desde servidor:", mapped);
    } else {
      console.log("Servidor devolvió carrito vacío, mantengo localStorage");
    }
  } catch (err) {
    console.error("Error cargando carrito:", err);
  }
};

// Actualizar la cantidad del producto
export const actualizarCantidadServidor = async (productId: number, cantidad: number) => {
  const token = localStorage.getItem("token");
  if (!token?.trim()) return;

  try {
    const response = await fetch(`${BASE_URL}/api/carrito/${productId}`, {
      method: "PUT",
      headers: {
        ...authHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ cantidad }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar cantidad en el servidor");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};


//Eliminar producto
export const eliminarItemServidor = async (productId: number) => {
  const token = localStorage.getItem("token");
  if (!token?.trim()) return;

  try {
    const response = await fetch(`${BASE_URL}/api/carrito/producto/${productId}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar producto en servidor");
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// 👉 Vacía el carrito del usuario logueado en el servidor
export const vaciarCarritoServidor = async () => {
  const token = localStorage.getItem("token");
  if (!token || token.trim() === "") return;

  try {
    const response = await fetch(`${BASE_URL}/api/carrito/vaciar`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    if (!response.ok) {
      console.error("Error al vaciar carrito en servidor:", response.statusText);
    } else {
      console.log("Carrito vaciado correctamente en servidor");
    }
  } catch (err) {
    console.error("Error vaciando carrito en servidor:", err);
  }
};