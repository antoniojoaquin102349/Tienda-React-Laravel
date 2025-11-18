
export default function AcercaDe() {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#111",
        color: "#fff",
        padding: "40px",
        lineHeight: 1.6,
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          backgroundColor: "#1c1c1c",
          padding: "30px",
          borderRadius: "10px",
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

        <a
          href="/"
          style={{
            display: "block",
            width: "fit-content",
            margin: "40px auto 0",
            backgroundColor: "#f1c40f",
            color: "#000",
            padding: "12px 20px",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            transition: "background-color 0.3s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d4ac0d")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#f1c40f")
          }
        >
          ← Volver a la página principal
        </a>
      </div>
    </div>
  );
}
