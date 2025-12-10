import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

export default function AcercaDe() {
  return (
    
    <div
  style={{
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f9f9f9", // fondo claro para toda la página
    color: "#000", // texto negro para que se vea
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  }}
>
  {/* HEADER */}
  <Header />

  {/* CONTENIDO PRINCIPAL */}
  <div
    style={{
      maxWidth: "800px",
      margin: "40px auto", // espacio arriba y abajo
      backgroundColor: "#1c1c1c",
      color: "#fff", // texto dentro del contenedor oscuro
      padding: "30px",
      borderRadius: "10px",
      lineHeight: 1.6,
      flex: 1, // ocupa el espacio disponible
    }}
  >
        <h1
          style={{
            color: "#f1c40f",
            textAlign: "center",
          }}
        >
          Sobre Repuestos Carmona
        </h1>

        <p>
          <strong>Repuestos Carmona</strong> es tu tienda especializada en
          repuestos y accesorios para vehículos <strong>4x4 y todoterreno</strong>.
          Nacida de la pasión por la aventura, la mecánica y el rendimiento en
          condiciones extremas, en Repuestos Carmona trabajamos cada día para
          ofrecerte los mejores productos del mercado a precios competitivos.
        </p>

        <p>
          Contamos con un catálogo cuidadosamente seleccionado que incluye{" "}
          <strong>
            paragolpes reforzados, sistemas de suspensión, llantas off-road,
            accesorios personalizados y componentes eléctricos
          </strong>{" "}
          para que tu vehículo esté preparado para cualquier desafío, ya sea
          montaña, desierto o barro.
        </p>

        <p>
          Nos comprometemos con la <strong>calidad, la durabilidad y la compatibilidad</strong>,
          trabajando solo con marcas confiables y productos probados en
          condiciones reales. Ya seas un aficionado al off-road o un profesional
          del sector, en Repuestos Carmona encontrarás lo que necesitas para
          mantener tu todoterreno en su mejor forma.
        </p>

        <p>
          Además, nuestro equipo está formado por entusiastas y expertos en el
          sector, listos para asesorarte y ayudarte a elegir la mejor solución
          según tus necesidades. Porque no se trata solo de piezas, sino de
          confianza en cada kilómetro.
        </p>
      </div>
      {/* FOOTER */}
      <Footer /> 
    </div>
  );
}
