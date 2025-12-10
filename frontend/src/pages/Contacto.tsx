import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState } from "react";


const Contacto = () => {
const [form, setForm] = useState({
nombre: "",
email: "",
asunto: "",
mensaje: "",
});

const [errores, setErrores] = useState<any>({});
const [exito, setExito] = useState(false);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
const { name, value } = e.target;
setForm({ ...form, [name]: value });
};

const validarFormulario = () => {
const err: any = {};
if (!form.nombre.trim()) err.nombre = "El nombre es obligatorio";
if (!form.email.trim()) {
err.email = "El email es obligatorio";
} else {
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
if (!emailRegex.test(form.email)) {
err.email = "Email inválido";
}
}
if (!form.asunto.trim()) err.asunto = "El asunto es obligatorio";
if (!form.mensaje.trim()) err.mensaje = "El mensaje no puede estar vacío";


setErrores(err);
return Object.keys(err).length === 0;


};

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (!validarFormulario()) return;


// Aquí enviarías el formulario a tu API/backend
console.log("Formulario enviado:", form);
setExito(true);
setForm({ nombre: "", email: "", asunto: "", mensaje: "" });


};

return ( 
  <div className="flex flex-col min-h-screen"> <div className="flex-1 flex items-center justify-center p-6 bg-gray-50"> <div className="max-w-2xl w-full  bg-white rounded-3xl shadow-xl p-10"> 
    
    {/* HEADER fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

    <h1 className="text-4xl font-bold mb-6 text-center mt-6">Contacto</h1>


      {exito && (
        <div className="bg-green-100 text-green-700 p-4 rounded mb-6 text-center">
          ¡Mensaje enviado correctamente!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-yellow-400"
          />
          {errores.nombre && <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>}
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-yellow-400"
          />
          {errores.email && <p className="text-red-500 text-sm mt-1">{errores.email}</p>}
        </div>

        <div>
          <input
            type="text"
            name="asunto"
            placeholder="Asunto"
            value={form.asunto}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-yellow-400"
          />
          {errores.asunto && <p className="text-red-500 text-sm mt-1">{errores.asunto}</p>}
        </div>

        <div>
          <textarea
            name="mensaje"
            placeholder="Escribe tu mensaje..."
            value={form.mensaje}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg focus:outline-yellow-400 h-32"
          ></textarea>
          {errores.mensaje && <p className="text-red-500 text-sm mt-1">{errores.mensaje}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-lg transition"
        >
          Enviar mensaje
        </button>
      </form>

      <div className="mt-8 text-center text-gray-600 space-y-2">
        <p>Email: <a href="mailto:info@autopartsexpress.com" className="text-yellow-600 hover:underline">info@autopartsexpress.com</a></p>
        <p>Teléfono: <a href="tel:+34123456789" className="text-yellow-600 hover:underline">+34 123 456 789</a></p>
        <p>Dirección: Calle Ejemplo 123, Madrid, España</p>        
      </div>
    </div>
  </div>

  {/* FOOTER */}
  <Footer/>

</div>


);
};

export default Contacto;
