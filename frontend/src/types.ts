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
  carrito: Producto[];
}

export interface Producto {
  id: number;
  nombre: string;
  referencia: string;
  precio: number | string;
  descripcion?: string;
  cantidad: number;
  imagen?: string;
  stock?: number; // <-- stock incluido
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
  imagen?: string;
  stock?: number; 
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

