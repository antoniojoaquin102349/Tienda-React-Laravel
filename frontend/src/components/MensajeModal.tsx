// src/components/MensajeModal.tsx


import type { ReactNode } from 'react';
import { useEffect } from 'react';

interface MensajeModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  mensaje?: string;
  children?: ReactNode;
  mostrarBotones?: boolean;
  textoBotonPrimario?: string;
  textoBotonSecundario?: string;
  onConfirmar?: () => void;
  tipoContenido?: 'producto' | 'confirmacion' | 'mensaje';
  mostrarCerrar?: boolean; 
  autoCerrarMs?: number;    
}

const MensajeModal: React.FC<MensajeModalProps> = ({
  isOpen,
  onClose,
  titulo,
  mensaje,
  children,
  mostrarBotones = false,
  textoBotonPrimario = 'Confirmar',
  textoBotonSecundario = 'Cancelar',
  onConfirmar,
  tipoContenido = 'mensaje',
  mostrarCerrar = true,
  autoCerrarMs
}) => {

  // Auto-cierre
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
      onClick={autoCerrarMs ? undefined : onClose} // si tiene auto-cierre, click fuera no cierra
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto relative ${
          tipoContenido === 'producto' ? 'p-10' : 'p-8'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {mostrarCerrar && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-4xl text-gray-500 hover:text-gray-800 z-10"
          >
            ×
          </button>
        )}

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{titulo}</h2>
          {mensaje && <p className="text-gray-700 mb-6">{mensaje}</p>}
          
          {children && (
            <div className="mb-6">{children}</div>
          )}

          {mostrarBotones && (
            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-300 rounded-xl hover:bg-gray-400 font-semibold flex-1 max-w-xs"
              >
                {textoBotonSecundario}
              </button>
              {onConfirmar && (
                <button
                  onClick={onConfirmar}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold flex-1 max-w-xs"
                >
                  {textoBotonPrimario}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default MensajeModal;