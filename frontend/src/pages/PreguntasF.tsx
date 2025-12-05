import { ChevronDown, ChevronUp } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import type { Preguntas } from "../types";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const faqData: Preguntas[] = [

  {
    question: "¿Qué tipo de piezas off-road venden?",
    answer:
      "Ofrecemos suspensiones, llantas, neumáticos, protecciones, snorkels, winches, iluminación LED y más. Todos los productos están diseñados para soportar condiciones extremas."
  },
  {
    question: "¿Cómo saber si una pieza es compatible con mi coche?",
    answer:
      "Cada ficha de producto incluye los modelos compatibles. Si no estás seguro, nuestro soporte puede confirmarlo antes de comprar."
  },
  {
    question: "¿Cuánto tarda el envío?",
    answer:
      "Generalmente 1-3 días de preparación y 3-7 días de envío. También ofrecemos envío exprés."
  },
  {
    question: "¿Puedo devolver un producto?",
    answer:
      "Sí, aceptamos devoluciones dentro de los 15 días posteriores a la entrega, siempre que el producto esté en perfecto estado."
  },
  {
    question: "¿Ofrecen garantía?",
    answer:
      "Todos nuestros productos incluyen garantía oficial del fabricante (entre 6 y 12 meses)."
  },
  {
    question: "¿Tienen asistencia para instalación?",
    answer:
      "Sí, ofrecemos guías básicas y asesoramiento. Para instalaciones complejas recomendamos un taller especializado."
  }
];

const Faq: React.FC = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      {/* HEADER fijo */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* CONTENIDO FAQ */}
      <div className="max-w-4xl mx-auto px-6 py-12 flex-grow mt-10">
        <h2 className="text-3xl font-bold text-center mb-10 text-gray-800">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-5 transition-all"
            >
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => setOpen(open === index ? null : index)}
              >
                <span className="text-lg font-semibold text-gray-800">
                  {item.question}
                </span>
                {open === index ? (
                  <ChevronUp size={24} />
                ) : (
                  <ChevronDown size={24} />
                )}
              </button>

              <div
                className={`mt-3 text-gray-600 transition-all ${
                  open === index ? "block" : "hidden"
                }`}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <Footer/>

    </div>
  );
};

export default Faq;
