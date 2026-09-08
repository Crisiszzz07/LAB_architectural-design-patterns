import React from 'react';
import { HandlerNode } from '../../types';
import { 
  ArrowRight, 
  ArrowDown,
  Trash2, 
  Settings2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  HelpCircle
} from 'lucide-react';

interface HandlerNodeViewProps {
  handler: HandlerNode;
  index: number;
  totalHandlers: number;
  isActive: boolean;
  isEvaluating: boolean;
  isHandled: boolean;
  isDelegated: boolean;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onEdit: () => void;
  onDelete: () => void;
  disabledActions: boolean;
}

export const HandlerNodeView: React.FC<HandlerNodeViewProps> = ({
  handler,
  index,
  totalHandlers,
  isActive,
  isEvaluating,
  isHandled,
  isDelegated,
  onMoveLeft,
  onMoveRight,
  onEdit,
  onDelete,
  disabledActions,
}) => {
  // Estilos según el estado de la simulación
  let statusBorder = 'border-[#E8E2D4]';
  let outerBg = 'bg-[#E8E2D4]/50';
  let badgeColor = 'bg-[#FAF8FD] text-[#5A5478] border-[#E8E2D4]';

  if (isHandled) {
    statusBorder = 'border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.25)]';
    outerBg = 'bg-emerald-100/70';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold';
  } else if (isEvaluating) {
    statusBorder = 'border-[#B57DDA] shadow-[0_0_20px_rgba(181,125,218,0.35)] animate-pulse';
    outerBg = 'bg-[#B57DDA]/20';
    badgeColor = 'bg-[#B57DDA]/25 text-[#41478B] border-[#B57DDA]/50 font-bold';
  } else if (isDelegated) {
    statusBorder = 'border-[#41478B]/40';
    outerBg = 'bg-[#FAF8FD]';
    badgeColor = 'bg-[#FAF8FD] text-[#41478B] border-[#E8E2D4]';
  }

  const formatThreshold = (val: number, unit?: string) => {
    if (unit === '$') return `$${val.toLocaleString()}`;
    if (unit) return `${val} ${unit}`;
    return val.toString();
  };

  return (
    <div className="flex flex-col md:flex-row items-center relative group">
      <div
        className={`relative ${outerBg} border ${statusBorder} p-1.5 rounded-[1.75rem] transition-all duration-500 ease-spring w-72 sm:w-80 shrink-0`}
      >
        <div className="relative bg-[#FFFFF6] shadow-[0_2px_12px_rgba(65,71,139,0.05)] rounded-[calc(1.75rem-0.375rem)] p-4 border border-[#E8E2D4]/50">
          
          {/* Header del nodo */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold border transition-colors ${
                  isHandled
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                    : isEvaluating
                    ? 'bg-[#B57DDA]/30 border-[#B57DDA] text-[#41478B]'
                    : 'bg-[#FAF8FD] border-[#E8E2D4] text-[#41478B]'
                }`}
              >
                {index + 1}
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#41478B] leading-tight">
                  {handler.name}
                </h4>
                <p className="text-[11px] font-mono text-[#B57DDA] font-semibold">
                  {handler.role}
                </p>
              </div>
            </div>

            {/* Controles de reorden y edición */}
            <div className="flex items-center gap-1 opacity-85 group-hover:opacity-100 transition-opacity">
              <button
                disabled={disabledActions || index === 0}
                onClick={onMoveLeft}
                className="w-6 h-6 rounded-md bg-[#FAF8FD] hover:bg-[#E8E2D4]/80 border border-[#E8E2D4] flex items-center justify-center text-[#41478B] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                title="Mover hacia adelante en la cadena"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={disabledActions || index === totalHandlers - 1}
                onClick={onMoveRight}
                className="w-6 h-6 rounded-md bg-[#FAF8FD] hover:bg-[#E8E2D4]/80 border border-[#E8E2D4] flex items-center justify-center text-[#41478B] disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                title="Mover hacia atrás en la cadena"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={disabledActions}
                onClick={onEdit}
                className="w-6 h-6 rounded-md bg-[#FAF8FD] hover:bg-[#B57DDA]/20 text-[#41478B] hover:text-[#B57DDA] border border-[#E8E2D4] flex items-center justify-center disabled:opacity-20 cursor-pointer"
                title="Editar umbral o propiedades"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={disabledActions || totalHandlers <= 1}
                onClick={onDelete}
                className="w-6 h-6 rounded-md bg-[#FAF8FD] hover:bg-rose-100 text-[#41478B] hover:text-rose-700 border border-[#E8E2D4] flex items-center justify-center disabled:opacity-20 cursor-pointer"
                title="Eliminar este eslabón"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Condición / Umbral del eslabón */}
          <div className="mb-3 p-2.5 rounded-xl bg-[#FAF8FD] border border-[#E8E2D4]">
            <div className="flex items-center justify-between text-[11px] text-[#5A5478] mb-1">
              <span className="flex items-center gap-1 font-mono">
                <HelpCircle className="w-3 h-3 text-[#AAA0BB]" />
                Criterio canHandle():
              </span>
              <span className="font-mono text-xs font-bold text-[#41478B]">
                {handler.operator === 'lte' ? '≤' : handler.operator === 'gte' ? '≥' : '='} {formatThreshold(handler.threshold, handler.unit)}
              </span>
            </div>
            <p className="text-[11px] text-[#5A5478] line-clamp-2 italic">
              "{handler.description}"
            </p>
          </div>

          {/* Estado de Ejecución en Vivo */}
          <div className="flex items-center justify-between pt-2 border-t border-[#E8E2D4]/70">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border ${badgeColor}`}
            >
              {isHandled ? (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> ¡Petición Atendida!
                </>
              ) : isEvaluating ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#B57DDA] animate-ping" />
                  Evaluando condición...
                </>
              ) : isDelegated ? (
                <>
                  <ArrowRight className="w-3 h-3 text-[#B57DDA]" /> Delegó a Sucesor
                </>
              ) : (
                <>En espera (Idle)</>
              )}
            </span>

            <span className="text-[10px] font-mono text-[#AAA0BB]">
              {index < totalHandlers - 1 ? 'next != null' : 'next == null (Fin)'}
            </span>
          </div>
        </div>
      </div>

      {/* Conector / Flecha entre eslabones */}
      {index < totalHandlers - 1 && (
        <div className="flex items-center justify-center my-2 md:my-0 md:mx-2 text-[#B57DDA] shrink-0">
          <div className="hidden md:flex items-center">
            <div className={`h-0.5 w-6 transition-colors duration-500 ${isDelegated ? 'bg-[#B57DDA]' : 'bg-[#E8E2D4]'}`} />
            <ArrowRight className={`w-5 h-5 transition-transform ${isDelegated ? 'text-[#B57DDA] scale-125' : 'text-[#AAA0BB]'}`} />
          </div>
          <div className="flex md:hidden flex-col items-center">
            <div className={`w-0.5 h-6 transition-colors duration-500 ${isDelegated ? 'bg-[#B57DDA]' : 'bg-[#E8E2D4]'}`} />
            <ArrowDown className={`w-5 h-5 transition-transform ${isDelegated ? 'text-[#B57DDA] scale-125' : 'text-[#AAA0BB]'}`} />
          </div>
        </div>
      )}
    </div>
  );
};
