import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Customer from "../pages/Customer"
import BaseDashBoard from "../pages/layout/BaseDashBoard";

export const routes = [
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
        path: "/dashboard",
        element: BaseDashBoard,
        children: [
            {
                path: "",
                element: Customer,
            },
        ],       
    }
];  