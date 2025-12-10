import { useNavigate, useSearchParams } from "react-router-dom";
import { loginUser, setCredentials } from "../slices/authSlice";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import InputLabel from "../components/input/InputLabel";
import Button from "../components/button/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAppDispatch, useAppSelector } from "../store";
import { useEffect } from "react";
import { agregarProducto, cargarCarrito } from "../slices/carritoSlice";
import type { Producto } from "../types";

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { islogin } = useAppSelector(state => state.auth);

  // Manejar login vía token (Google o URL)
  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    (async () => {
      localStorage.setItem("token", token);
      dispatch(setCredentials({ token }));

      // Sincronizar carrito local
      const localCart: Producto[] = JSON.parse(localStorage.getItem("carrito") || "[]");
      for (const producto of localCart) {
        try { await dispatch(agregarProducto({ producto })).unwrap(); } 
        catch (err) { console.error(err); }
      }

      await dispatch(cargarCarrito()).unwrap();
      localStorage.removeItem("carrito");
      navigate("/", { replace: true });
    })();
  }, [searchParams, dispatch, navigate]);

  useEffect(() => {
    if (islogin) navigate("/", { replace: true });
  }, [islogin, navigate]);

  const initialValues = { email: "", password: "" };
  const validationSchema = Yup.object({
    email: Yup.string().email("Correo inválido").required("Correo obligatorio"),
    password: Yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña obligatoria"),
  });

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const response = await dispatch(loginUser(values)).unwrap();
      if (response?.token) {
        localStorage.setItem("token", response.token);
        dispatch(setCredentials({ token: response.token, user: response.user }));

        // Sincronizar carrito local
        const localCart: Producto[] = JSON.parse(localStorage.getItem("carrito") || "[]");
        for (const producto of localCart) {
          try { await dispatch(agregarProducto({ producto })).unwrap(); } 
          catch (err) { console.error(err); }
        }

        await dispatch(cargarCarrito()).unwrap();
        localStorage.removeItem("carrito");
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      Swal.fire({ icon: "error", title: err?.message || "Usuario o contraseña incorrectos", timer: 2000, showConfirmButton: false });
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
          <div className="p-6 space-y-6 sm:p-8">
            <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Iniciar sesión</h1>

            <div className="flex justify-center">
              <button
                onClick={() => window.location.href = "http://localhost:8000/api/auth/google"}
                className="flex items-center gap-3 w-full justify-center px-6 py-3 bg-white border border-gray-300 rounded-lg shadow hover:shadow-md transition-all font-medium text-gray-700 hover:bg-gray-50"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Continuar con Google
              </button>
            </div>

            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500 bg-white dark:bg-gray-800">o</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
              {({ errors, handleSubmit, handleChange, values, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <InputLabel label="Correo electrónico" id="email" name="email" type="email" placeholder="tu@email.com" value={values.email} onChange={handleChange} error={errors.email} />
                  <InputLabel label="Contraseña" id="password" name="password" type="password" placeholder="••••••••" value={values.password} onChange={handleChange} error={errors.password} />
                  <Button value={isSubmitting ? "Iniciando..." : "Iniciar sesión"} type="submit" disabled={isSubmitting} />
                  <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    ¿No tienes cuenta? <a href="/register" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Regístrate aquí</a>
                  </p>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <Footer />
    </section>
  );
};

export default Login;
