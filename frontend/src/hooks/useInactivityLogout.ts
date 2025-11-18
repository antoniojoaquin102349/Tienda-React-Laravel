import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../store/authSlice";

export const useInactivityLogout = (inactiveMinutes = 60) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const inactiveMs = inactiveMinutes * 60 * 1000;

    const updateActivity = () => {
      localStorage.setItem("lastActivity", Date.now().toString());
    };

    // Guardar actividad inicial si no existe
    if (!localStorage.getItem("lastActivity")) {
      updateActivity();
    }

    // Verificar al montar si ya expiró
    const last = Number(localStorage.getItem("lastActivity"));
    if (Date.now() - last > inactiveMs) {
      dispatch(logoutUser());
      navigate("/login", { replace: true });
      alert("Sesión cerrada por inactividad");
      return;
    }

    // Timer que verifica cada X segundos
    const interval = setInterval(() => {
      const lastActivity = Number(localStorage.getItem("lastActivity"));
      if (Date.now() - lastActivity > inactiveMs) {
        dispatch(logoutUser());
        navigate("/login", { replace: true });
        alert("Sesión cerrada por inactividad");
      }
    }, 5000); // verifica cada 5 segundos

    // Eventos que cuentan como actividad
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown",
    ];

    const activityHandler = () => {
      updateActivity();
    };

    events.forEach((event) =>
      window.addEventListener(event, activityHandler, true)
    );

    return () => {
      clearInterval(interval);
      events.forEach((event) =>
        window.removeEventListener(event, activityHandler, true)
      );
    };
  }, [dispatch, navigate, inactiveMinutes]);
};
