import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AcercaDe from "../pages/acercade";
import Cesta from "../pages/Cesta.tsx";
import AuthGoogleCallback from "../pages/auth/AuthGoogleCallback";

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

    
    
];  