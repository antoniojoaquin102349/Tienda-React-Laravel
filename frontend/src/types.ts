// src/types.ts
import type { ReactNode } from "react";

export interface IUser {
  id: number;
  name: string;
  email: string;
}

export interface DatosUsuario {
telefono?: string;
direccion: string;
ciudad: string;
codigo_postal: string;
numero_tarjeta?: string;
nombre_tarjeta?: string;
numero_seguridad?: string;
fecha_vencimiento?: string;
metodo_pago_guardado: boolean;
}

export interface AuthState {
  token: string | null;
  user: IUser | null;
  islogin: boolean;
  isloading: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  referencia: string;
  precio: number;
  descripcion?: string;
  cantidad: number;
  imagen: string | null;
  stock?: number; 
}

export interface ProductosProps {
  titulo?: string;
  limit?: number;
  endpoint?: string;
  mostrarBadge?: boolean;
  columnas?: "1" | "2" | "3" | "4";
  onImagenClick?: (producto: ProductoDato | null) => void;
}

export interface ProductoDato {
  id: number;
  nombre: string;
  referencia: string;
  precio: number | string;
  descripcion?: string;
  imagen: string | null;
  stock?: number; 
}

export interface CarritoState {
  items: Producto[];
  isLoading: boolean;
  error: string | null;
}

export interface Pedido {
  id: number;
  total: number;
  estado?: string;
  created_at: string;
  productos: Producto[];
  envios_enviados?: {
  nombre_producto: string;
  transportista?: string | null;
  numero_seguimiento?: string | null;
  }[];
}

export interface MensajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  mensaje?: string;
  children?: ReactNode;
  mostrarBotones?: boolean;
  textoBotonPrimario?: string;
  textoBotonSecundario?: string;
  onConfirmar?: () => void;
  tipoContenido?: "producto" | "confirmacion" | "mensaje";
  mostrarCerrar?: boolean;
  autoCerrarMs?: number;
  accionBotonSecundario?: "cerrar" | "redirigir";
  urlRedirigir?: string
}
export interface Preguntas {
question: string;
answer: string;
}

