// src/App.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Provider, useDispatch } from "react-redux";
import { routes } from "./routes/route";
import { createElement, useEffect } from "react";
import { persistor, store } from "./store";
import ProtectedRoute from "./pages/ProtectedRoute";
import { checkAuth, logoutUser } from "./store/authSlice";

// Componente que se ejecuta cuando Redux ya está rehidratado
const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Intentamos validar el token con el backend
      dispatch(checkAuth() as any)
        .unwrap()
        .catch(() => {
          // Token inválido o expirado → limpiamos todo
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          dispatch(logoutUser());
        });
    } else {
      // No hay token → aseguramos estado limpio
      dispatch(logoutUser());
    }
  }, [dispatch]);

  return null; // Este componente no renderiza nada
};

function App() {
  const router = createBrowserRouter(
    routes.map((route) => ({
      ...route,
      element: route.isProtected ? (
        <ProtectedRoute children={createElement(route.element)} />
      ) : (
        createElement(route.element)
      ),
      children: route.children?.map((child) => ({
        ...child,
        element: child.isProtected ? (
          <ProtectedRoute children={createElement(child.element)} />
        ) : (
          createElement(child.element)
        ),
      })),
    }))
  );

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* Este componente se monta SOLO cuando el store está rehidratado */}
        <AuthInitializer />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
