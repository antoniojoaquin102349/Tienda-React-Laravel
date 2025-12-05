import { syncCarritoConServidor, loadCarritoDesdeServidor } from "../slices/carritoSlice";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { loginUser, setCredentials } from "../slices/authSlice";
import InputLabel from "../components/input/InputLabel";
import Button from "../components/button/Button";
import { useAppDispatch } from "../store";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { RootState } from "../store";
import type { Producto } from "../types";
import { useEffect } from "react";
import { Formik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";


const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { islogin } = useSelector((state: RootState) => state.auth);

  // 1. Detectar token o error del callback de Google
  useEffect(() => {
    const handleGoogleLogin = async () => {
      const token = searchParams.get("token");
      if (token) {
        localStorage.setItem("token", token);
        dispatch(setCredentials({ token }));

        const localCart: Producto[] = JSON.parse(localStorage.getItem("cart") || "[]");
        if (localCart.length > 0) {
          await syncCarritoConServidor(localCart);
        }

        await loadCarritoDesdeServidor((cart) => {
          dispatch({ type: "carrito/setCarrito", payload: cart });
        });

        localStorage.removeItem("cart");

        navigate("/", { replace: true });
      }
    };
    handleGoogleLogin();
  }, [searchParams, dispatch, navigate]);


  // 2. Redirección automática si ya está logueado (login normal o Google)
  useEffect(() => {
    if (islogin) {
      navigate("/", { replace: true });
    }
  }, [islogin, navigate]);

  // Validación del formulario
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Correo electrónico no válido")
      .required("El correo es obligatorio"),
    password: Yup.string()
      .min(6, "Mínimo 6 caracteres")
      .required("La contraseña es obligatoria"),
  });

  const onSubmit = async (values: typeof initialValues) => {
    try {
      // Esperar el login
      const response = await dispatch(loginUser(values));

      if (response.type === "auth/loginUser/fulfilled") {
        // 1️⃣ Revisar carrito de invitado
        const localCart: Producto[] = JSON.parse(localStorage.getItem("cart") || "[]");

        if (localCart.length > 0) {
          await syncCarritoConServidor(localCart); // enviar carrito al servidor
        }

        // 2️⃣ Cargar carrito definitivo del servidor
        await loadCarritoDesdeServidor((cart) => {
          dispatch({ type: "carrito/setCarrito", payload: cart });
        });

        // 3️⃣ Limpiar carrito de invitado
        localStorage.removeItem("cart");

        // 4️⃣ Redirigir
        navigate("/", { replace: true });
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Usuario o contraseña incorrectos",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      
      {/* HEADER fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>
      
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="p-6 space-y-6 sm:p-8">

            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              Iniciar sesión
            </h1>

            {/* Botón Google */}
            <div className="flex justify-center">
              <button
                onClick={() => {
                  window.location.href = "http://localhost:8000/api/auth/google";
                }}
                className="flex items-center gap-3 w-full justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg shadow hover:shadow-md transition-all duration-200 font-medium text-gray-700 hover:bg-gray-50"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                Continuar con Google
              </button>
            </div>

            {/* Separador "O" */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 bg-white dark:bg-gray-800">o</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Formulario */}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ errors, handleSubmit, handleChange, values, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <InputLabel
                    label="Correo electrónico"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={values.email}
                    onChange={handleChange}
                    error={errors.email}
                  />

                  <InputLabel
                    label="Contraseña"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={values.password}
                    onChange={handleChange}
                    error={errors.password}
                  />

                  <Button
                    value={isSubmitting ? "Iniciando..." : "Iniciar sesión"}
                    type="submit"
                    disabled={isSubmitting}
                  />

                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿No tienes cuenta?{" "}
                    <a
                      href="/register"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      Regístrate aquí
                    </a>
                  </p>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
     
      {/* FOOTER */}
      <Footer/>
        
    </section>
  );
};

export default Login;