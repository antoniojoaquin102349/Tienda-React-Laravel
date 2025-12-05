import AuthGoogleCallback from "../pages/auth/AuthGoogleCallback";
import HistorialPedidos from "../pages/HistorialPedidos";
import ListaProductos from "../pages/ListaProductos";
import PreguntasF from "../pages/PreguntasF.tsx";
import Contacto from "../pages/Contacto.tsx";
import Register from "../pages/Register";
import AcercaDe from "../pages/AcercaDe";
import Checkout from "../pages/Checkout";
import Cesta from "../pages/Cesta.tsx";
import Login from "../pages/Login";
import Datos from "../pages/Datos";
import Home from "../pages/Home";

type TypeRoute = { 
    path: string; 
    element: any; 
    isProtected?: boolean; 
    children?: TypeRoute[];
}


export const routes: TypeRoute[] = [
    { 
        path: "/", 
        element: Home
    },
    {
        path: "/login",
        element: Login
    },
    {
        path: "/register",
        element: Register
    },
    {
        path: "/auth/google/success",
        element: AuthGoogleCallback
    },
    {
        path: "/acercade",
        element: AcercaDe
    },
    {
        path: "/Cesta",
        element: Cesta
    },
    {
        path: "/productos",
        element: ListaProductos 
    },
    {
        path: "/historialPedidos", 
        element: HistorialPedidos 
    },
    {
        path: "/checkout", 
        element: Checkout
    },
    {
        path: "/contacto", 
        element: Contacto
    },
    {
        path: "/preguntas", 
        element: PreguntasF
    },
    {
        path: "/datos", 
        element: Datos
    }
]; 