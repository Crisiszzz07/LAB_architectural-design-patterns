import React from 'react';
import { AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';

interface UnhandledAlertProps {
  requestValue: number;
  unit: string;
  onAddCatchAllHandler: () => void;
}

export const UnhandledAlert: React.FC<UnhandledAlertProps> = ({
  requestValue,
  unit,
  onAddCatchAllHandler,
}) => {
  const formattedVal = unit === '$' ? `$${requestValue.toLocaleString()}` : `${requestValue} ${unit}`;

  return (
    <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-[#FFF9F6] border border-[#ECD1CD] shadow-sm text-french animate-fade-in">
      <div className="flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-full bg-rose-100/70 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h4 className="font-bold text-sm sm:text-base text-french">
              ⚠️ Alerta GoF: Solicitud No Atendida ("Receipt is not guaranteed")
            </h4>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#E8E2D4]/60 border border-[#E8E2D4] text-[#41478B]">
              Valor Solicitud: {formattedVal}
            </span>
          </div>

          <p className="text-xs text-[#41478B]/80 mt-1.5 leading-relaxed font-medium">
            La petición recorrió todos los eslabones configurados en la cadena sin que ninguno cumpliera la condición de manejo. Al llegar al último manejador con su referencia <code className="bg-[#FFFFF6] px-1.5 py-0.5 rounded font-mono text-[#41478B] border border-[#E8E2D4] font-bold" style={{ backgroundColor: '#FFFFF6' }}>successor == null</code>, la solicitud quedó sin atender; esta interfaz lo informa explícitamente.
          </p>

          <div 
            className="mt-3.5 p-3 rounded-xl bg-[#FFFFF6] border border-[#E8E2D4] text-xs text-[#41478B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            style={{ backgroundColor: '#FFFFF6' }}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#41478B] shrink-0" />
              <span><strong>Solución Arquitectónica Defensiva:</strong> Considera un terminal que rechace, registre o escale, o informa un error controlado. Un terminal no tiene que aprobar todo.</span>
            </span>
            <button
              onClick={onAddCatchAllHandler}
              className="px-3.5 py-1.5 rounded-full bg-[#41478B] hover:bg-[#2D2A4A] text-[#FFFFF6] font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-sm shrink-0"
            >
              <span>Añadir Manejador Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
