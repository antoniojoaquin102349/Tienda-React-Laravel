// src/pages/AuthGoogleCallback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";


const AuthGoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name"); // opcional, si tu backend devuelve el nombre

    if (token) {
      // Guardar en localStorage
      localStorage.setItem("token", token);

      // Actualizar Redux
      dispatch(setCredentials({ token, user: name ? {id: 0, name, email:"" } : undefined }));

      // Redirigir al Home
      navigate("/");
    } else {
      navigate("/login?error=google");
    }
  }, [navigate, dispatch]);

  return <div>Cargando...</div>;
};

export default AuthGoogleCallback;
