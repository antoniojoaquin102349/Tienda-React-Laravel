import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-600 text-white py-10 px-6 mt-10">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between">
        
        {/* Sobre la empresa */}
        <div className="flex-1 min-w-[250px] mb-6">
          <h3 className="text-lg font-semibold mb-4">Repuestos Carmona</h3>
          <p>
            Tu tienda online de confianza para todas las piezas y accesorios de coche. 
            Calidad garantizada y envío rápido.
          </p>
        </div>

        {/* Enlaces rápidos */}
        <div className="flex-1 min-w-[150px] mb-6">
          <h4 className="text-md font-semibold mb-4">Enlaces rápidos</h4>
          <ul className="space-y-2">
            <li><Link to="/productos" className="hover:underline">Productos</Link></li>
            <li><Link to="/acercade" className="hover:underline">Sobre nosotros</Link></li>
            <li><Link to="/contacto" className="hover:underline">Contacto</Link></li>
            <li><Link to="/preguntas" className="hover:underline">FAQ</Link></li>
          </ul>
        </div>

        {/* Contacto */}
        <div className="flex-1 min-w-[200px] mb-6">
          <h4 className="text-md font-semibold mb-4">Contacto</h4>
          <p>
            Email:{" "}
            <a href="mailto:info@autopartsexpress.com" className="hover:underline">
              info@autopartsexpress.com
            </a>
          </p>
          <p>
            Teléfono:{" "}
            <a href="tel:+34123456789" className="hover:underline">
              +34 123 456 789
            </a>
          </p>
          <p>Dirección: Calle Ejemplo 123, Madrid, España</p>
        </div>

        {/* Redes sociales */}
        <div className="flex-1 min-w-[150px] mb-6">
          <h4 className="text-md font-semibold mb-4">Síguenos</h4>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/" className="hover:text-yellow-500">Facebook</a>
            <a href="https://www.instagram.com/" className="hover:text-yellow-500">Instagram</a>
            <a href="https://twitter.com/" className="hover:text-yellow-500">Twitter</a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-400 text-sm">
        &copy; 2025 Repuestos Carmona. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
