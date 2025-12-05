import { useEffect } from "react";
import type { MensajeModalProps } from "../types";

const MensajeModal: React.FC<MensajeModalProps> = ({
  isOpen,
  onClose,
  titulo,
  mensaje,
  children,
  mostrarBotones = false,
  textoBotonPrimario = "Confirmar",
  textoBotonSecundario = "Cancelar",
  onConfirmar,
  tipoContenido = "mensaje",
  mostrarCerrar = true,
  autoCerrarMs,
  accionBotonSecundario,
  urlRedirigir
}) => {

  useEffect(() => {
    if (isOpen && autoCerrarMs) {
      const timer = setTimeout(onClose, autoCerrarMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCerrarMs, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative p-8`}
        onClick={(e) => e.stopPropagation()}
      >
        {mostrarCerrar && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-3xl text-gray-500 hover:text-gray-800 z-10"
          >
            ×
          </button>
          
        )}

        <div className="flex flex-col justify-between min-h-[150px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{titulo}</h2>
            {mensaje && <p className="text-gray-700 mb-6 text-l">{mensaje}</p>}
            {children && <div className="mb-6">{children}</div>}
          </div>

          {mostrarBotones && (
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  if (accionBotonSecundario === "redirigir" && urlRedirigir) {
                    window.location.href = urlRedirigir;
                  } else {
                    onClose();
                  }
                }}
                className="px-6 py-3 bg-gray-300 rounded-xl hover:bg-gray-400 font-semibold flex-1 max-w-xs"
              >
                {textoBotonSecundario}
              </button>
              <button
                onClick={onConfirmar}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold flex-1 max-w-xs"
              >
                {textoBotonPrimario}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MensajeModal;
