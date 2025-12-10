// store/carritoSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import { authHeaders } from "../services/Api";
import type { CarritoState, Producto } from "../types";
import type { AppDispatch } from "../store";

const BASE_URL = import.meta.env.VITE_APP_URL || "http://localhost:8000";

// ====================
// THUNKS ASÍNCRONOS (Usuarios logueados)
// ====================

// Cargar carrito desde backend
export const cargarCarrito = createAsyncThunk<Producto[], void>(
  "carrito/cargarCarrito",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token?.trim()) return [];

    try {
      const res = await fetch(`${BASE_URL}/api/carrito`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Error al cargar carrito");
      const data = await res.json();
      const items = Array.isArray(data) ? data : data.carrito || data.cart || [];
      return items.map((i: any) => ({
        id: i.id,
        nombre: i.nombre,
        referencia: i.referencia,
        precio: parseFloat(i.precio),
        cantidad: i.cantidad,
        imagen: i.imagen,
        stock: i.stock,
      }));
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Agregar producto al backend
export const agregarProducto = createAsyncThunk<Producto, { producto: Producto }>(
  "carrito/agregarProducto",
  async ({ producto }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token?.trim()) return rejectWithValue("No autenticado");

    try {
      const res = await fetch(`${BASE_URL}/api/carrito`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ producto_id: producto.id, cantidad: producto.cantidad }),
      });
      if (!res.ok) throw new Error("Error al agregar producto");
      const data = await res.json();
      return {
        id: data.id || producto.id,
        nombre: data.nombre || producto.nombre,
        referencia: data.referencia || producto.referencia,
        precio: parseFloat(data.precio) || producto.precio,
        cantidad: data.cantidad || producto.cantidad,
        imagen: data.imagen || producto.imagen,
        stock: data.stock,
      };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Actualizar cantidad en backend
export const actualizarCantidad = createAsyncThunk<{ id: number; cantidad: number }, { id: number; cantidad: number }>(
  "carrito/actualizarCantidad",
  async ({ id, cantidad }, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token?.trim()) return rejectWithValue("No autenticado");

    try {
      const res = await fetch(`${BASE_URL}/api/carrito/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ cantidad }),
      });
      if (!res.ok) throw new Error("Error al actualizar cantidad");
      return { id, cantidad };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Eliminar producto del backend
export const eliminarProducto = createAsyncThunk<number, number>(
  "carrito/eliminarProducto",
  async (id, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token?.trim()) return rejectWithValue("No autenticado");

    try {
      const res = await fetch(`${BASE_URL}/api/carrito/producto/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error("Error al eliminar producto");
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Vaciar carrito en backend
export const vaciarCarritoServidor = createAsyncThunk(
  "carrito/vaciarCarritoServidor",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/api/carrito/vaciar`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) {
        const text = await res.text();
        return rejectWithValue(text || "Error vaciando carrito");
      }
      return true;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// ====================
// SLICE
// ====================
const initialState: CarritoState = {
  items: [],
  isLoading: false,
  error: null,
};

const carritoSlice = createSlice({
  name: "carrito",
  initialState,
  reducers: {
    reset: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },
    setItems: (state, action: PayloadAction<Producto[]>) => {
      state.items = action.payload;
    },

    // Fusión carrito invitado con backend
    fusionarInvitado: (state, action: PayloadAction<Producto[]>) => {
      action.payload.forEach((p) => {
        const existing = state.items.find((i) => i.id === p.id);
        if (existing) {
          existing.cantidad += p.cantidad;
        } else {
          state.items.push(p);
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // cargarCarrito
      .addCase(cargarCarrito.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(cargarCarrito.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; })
      .addCase(cargarCarrito.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })

      // agregarProducto
      .addCase(agregarProducto.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(agregarProducto.fulfilled, (state, action) => {
        state.isLoading = false;
        const existing = state.items.find(i => i.id === action.payload.id);
        if (existing) existing.cantidad += action.payload.cantidad;
        else state.items.push(action.payload);
      })
      .addCase(agregarProducto.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })

      // actualizarCantidad
      .addCase(actualizarCantidad.fulfilled, (state, action) => {
        const item = state.items.find(i => i.id === action.payload.id);
        if (item) item.cantidad = action.payload.cantidad;
      })

      // eliminarProducto
      .addCase(eliminarProducto.fulfilled, (state, action) => {
        state.items = state.items.filter(i => i.id !== action.payload);
      })

      // vaciarCarritoServidor
      .addCase(vaciarCarritoServidor.fulfilled, (state) => { state.items = []; })
      .addCase(vaciarCarritoServidor.rejected, (state, action) => { state.error = action.payload as string; });
  },
});

// ====================
// ACCIONES PARA INVITADO
// ====================
export const agregarProductoInvitado = (producto: Producto) => (dispatch: AppDispatch) => {
  const data = localStorage.getItem("carrito");
  const carrito: Producto[] = data ? JSON.parse(data) : [];

  const existing = carrito.find(p => p.id === producto.id);
  if (existing) {
    existing.cantidad += producto.cantidad;
  } else {
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  dispatch(carritoSlice.actions.setItems(carrito));
};

// Fusionar carrito invitado al iniciar sesión
export const fusionarCarritoInvitado = () => (dispatch: AppDispatch) => {
  const data = localStorage.getItem("carrito");
  if (!data) return;
  const carritoInvitado: Producto[] = JSON.parse(data);
  dispatch(carritoSlice.actions.fusionarInvitado(carritoInvitado));
  localStorage.removeItem("carrito");
};

export const { reset, setItems, fusionarInvitado } = carritoSlice.actions;
export default carritoSlice.reducer;
