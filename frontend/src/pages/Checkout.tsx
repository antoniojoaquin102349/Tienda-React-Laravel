import MensajeModal from "../components/MensajeModal";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../store/authSlice";
import { useState, useEffect } from "react";
import { Api } from "../services/Api";
import { store } from "../store";


const Checkout = () => {
  const [carrito, setCarrito] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [_guardadoPrevio, setGuardadoPrevio] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("carrito");
    if (data) {
      setCarrito(JSON.parse(data));
    } else {
      navigate("/");
    }

    const metodoGuardado = localStorage.getItem("metodo_pago_guardado");
    if (metodoGuardado) setGuardadoPrevio(true);
  }, [navigate]);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    cp: "",
    envio: "standard",
    pago: "tarjeta",
    guardarPago: false,
    notas: "",
    // Campos tarjeta
    numeroTarjeta: "",
    vencimiento: "",
    cvv: "",
    nombreTarjeta: "",
  });

  const [errores, setErrores] = useState<any>({});

  const handleChange = (e: any) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value;

    setForm({
      ...form,
      [name]: checked,
    });
  };

  const validarFormulario = () => {
    const err: any = {};

    if (!form.nombre.trim()) err.nombre = "El nombre es obligatorio";

    if (!form.email.trim()) {
      err.email = "El email es obligatorio";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        err.email = `Email "${form.email}" incorrecto`;
      }
    }
    if (!form.telefono.trim()) {err.telefono = "El teléfono es obligatorio";}
    if (!form.direccion.trim()) err.direccion = "La dirección es obligatoria";
    if (!form.ciudad.trim()) err.ciudad = "La ciudad es obligatoria";
    if (!form.cp.trim()) err.cp = "El código postal es obligatorio";

    // Validación de tarjeta si se selecciona tarjeta
    if (form.pago === "tarjeta") {
      if (!form.numeroTarjeta.trim()) err.numeroTarjeta = "Número de tarjeta obligatorio";
      if (!form.vencimiento.trim()) err.vencimiento = "Fecha de vencimiento obligatoria";
      if (!form.cvv.trim()) err.cvv = "CVV obligatorio";
      if (!form.nombreTarjeta.trim()) err.nombreTarjeta = "Nombre en la tarjeta obligatorio";
    }

    setErrores(err);
    return Object.keys(err).length === 0;
  };

  const total = carrito.reduce(
    (acc: number, item: any) =>
      acc + (parseFloat(item.precio) || 0) * (item.cantidad || 1),
    0
  );

  const [mostrarLoginModal, setMostrarLoginModal] = useState(false);

  const realizarPedido = async () => {
    if (!validarFormulario() || loading) return;

    setLoading(true);
    setMensaje("");

    try {
      // Primero verificamos si el email del formulario ya existe en el backend
      const existeResp = await Api.post("/check-email", { email: form.email });
      const existeData = (existeResp as any).data;

      if (existeData?.existe) {
        // El usuario ya está registrado pero no tiene token → mostrar modal
        const tokenExistente = localStorage.getItem("token");
        if (!tokenExistente) {
          setMostrarLoginModal(true);
          setLoading(false);
          return;
        }
      }

      // Si no existe, seguimos normalmente → backend creará usuario automáticamente
      const response = await Api.post("/guardar-pedido", { cliente: form, carrito });
      const resp = response as any;
      const data = resp.data;

      if (!data) {
        setMensaje("Error: respuesta inválida del servidor");
        setLoading(false);
        return;
      }

      const token = data.token ?? resp.token;

      if (token) {
        localStorage.setItem("token", token);
        const meResp = await Api.get("/me");
        const me = (meResp as any).data;
        if (me?.user) {
          localStorage.setItem("user", JSON.stringify(me.user));
          store.dispatch(setCredentials({ token, user: me.user }));
        }
      }

      localStorage.removeItem("carrito");
      setCarrito([]);
      setExito(true);
      setTimeout(() => navigate("/", { replace: true }), 2000);

    } catch (error) {
      console.error(error);
      setMensaje("Error al procesar el pedido");
    } finally {
      setLoading(false);
    }
  };

  if (exito) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-2xl p-16 text-center max-w-lg w-full animate-bounce">
          <div className="w-28 h-28 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-20 h-20 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">¡Pedido realizado!</h1>
          <p className="text-2xl text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">

      {mensaje && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg z-50 animate-pulse">
          {mensaje}
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

        <h1 className="text-4xl font-bold mb-8 text-center">Finalizar Compra</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input type="text" name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={handleChange} className="border p-3 rounded-lg w-full" />
            {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
          </div>

          <div>
            <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} className="border p-3 rounded-lg w-full" />
            {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
          </div>

          <div>
            <input type="text" name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} className="border p-3 rounded-lg w-full" />
            {errores.telefono && <p className="text-red-500 text-sm mt-1">{errores.telefono}</p>}
          </div>

          <div className="md:col-span-2">
            <input type="text" name="direccion" placeholder="Dirección" value={form.direccion} onChange={handleChange} className="border p-3 rounded-lg w-full" />
            {errores.direccion && <p className="text-red-500 text-sm mt-1">{errores.direccion}</p>}
          </div>

          <div>
            <input type="text" name="ciudad" placeholder="Ciudad" value={form.ciudad} onChange={handleChange} className="border p-3 rounded-lg w-full" />
            {errores.ciudad && <p className="text-red-500 text-sm mt-1">{errores.ciudad}</p>}
          </div>

          <div>
            <input type="text" name="cp" placeholder="Código Postal" value={form.cp} onChange={handleChange} className="border p-3 rounded-lg w-full" />
            {errores.cp && <p className="text-red-500 text-sm mt-1">{errores.cp}</p>}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="envio" className="block font-bold mb-2">Método de envío</label>
            <select id="envio" name="envio" value={form.envio} onChange={handleChange} className="border p-3 rounded-lg w-full">
              <option value="standard">Envío estándar (5€)</option>
              <option value="express">Envío express (10€)</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="pago" className="block font-bold mb-2">Método de pago</label>
            <select id="pago" name="pago" value={form.pago} onChange={handleChange} className="border p-3 rounded-lg w-full">
              <option value="tarjeta">Tarjeta</option>
              <option value="paypal">PayPal</option>
              <option value="transferencia">Transferencia bancaria</option>
            </select>
          </div>
        </div>

        {/* FORMULARIO TARJETA */}
        {form.pago === "tarjeta" && (
          <div className="mt-6 p-6 border rounded-xl bg-gray-50">
            <h2 className="text-xl font-bold mb-4">Datos de la tarjeta</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  name="numeroTarjeta"
                  placeholder="Número de tarjeta"
                  value={form.numeroTarjeta}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
                {errores.numeroTarjeta && <p className="text-red-500 text-sm mt-1">{errores.numeroTarjeta}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="vencimiento"
                  placeholder="MM/AA"
                  value={form.vencimiento}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
                {errores.vencimiento && <p className="text-red-500 text-sm mt-1">{errores.vencimiento}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={form.cvv}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
                {errores.cvv && <p className="text-red-500 text-sm mt-1">{errores.cvv}</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  type="text"
                  name="nombreTarjeta"
                  placeholder="Nombre en la tarjeta"
                  value={form.nombreTarjeta}
                  onChange={handleChange}
                  className="border p-3 rounded-lg w-full"
                />
                {errores.nombreTarjeta && <p className="text-red-500 text-sm mt-1">{errores.nombreTarjeta}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2 mt-2">
                  <input
                    type="checkbox"
                    name="guardarPago"
                    checked={form.guardarPago}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <span>Guardar método de pago</span>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10 text-right">
          <p className="text-3xl font-bold mb-6">Total: <span className="text-green-600">{total.toFixed(2)} €</span></p>

          <button
            onClick={realizarPedido}
            disabled={loading}
            className={`px-12 py-5 rounded-xl text-xl font-bold transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Procesando..." : "Realizar Pedido"}
          </button>

          <Link to="/cesta" className="block mt-4 text-gray-500 hover:underline">← Volver al carrito</Link>
        </div>
        
        {/* ----------------- MODAL ----------------- */}
        <MensajeModal
          isOpen={mostrarLoginModal}
          onClose={() => {
            setMostrarLoginModal(false);
            navigate("/login");
          }}
        titulo="Debes iniciar sesión"
        mensaje="Para realizar un pedido debes iniciar sesión."
        autoCerrarMs={1800}
        mostrarCerrar={false}
        /> 

      </div>
    </div>
  );
};

export default Checkout;
