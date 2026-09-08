import React from 'react';
import { SimulationStep } from '../../types';
import { Terminal, Check, ArrowRight, AlertTriangle, Send } from 'lucide-react';

interface ExecutionLogProps {
  steps: SimulationStep[];
  currentStepIndex: number;
}

export const ExecutionLog: React.FC<ExecutionLogProps> = ({
  steps,
  currentStepIndex,
}) => {
  return (
    <div className="flex flex-col h-full bg-porcelain rounded-2xl border border-bone shadow-sm overflow-hidden">
      
      {/* Header del Log */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-bone/35 border-b border-bone">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-french" />
          <span className="text-xs font-mono font-bold text-french">
            Telemetría de Ejecución (Decision Trace)
          </span>
        </div>
        <span className="text-[10px] font-mono text-french/60">
          Eventos: {steps.length}
        </span>
      </div>

      {/* Lista de Eventos */}
      <div className="p-3 overflow-y-auto max-h-56 space-y-2 font-mono text-xs">
        {steps.length === 0 ? (
          <div className="text-french/50 italic text-center py-6 text-[11px]">
            Presiona "Emitir Petición" para iniciar la traza de ejecución del patrón.
          </div>
        ) : (
          steps.slice(0, currentStepIndex + 1).map((step, idx) => {
            const isCurrent = idx === currentStepIndex;

            let icon = <ArrowRight className="w-3 h-3 text-lavender" />;
            let borderColor = 'border-bone';
            let bgColor = 'bg-bone/20';

            if (step.status === 'handled') {
              icon = <Check className="w-3 h-3 text-emerald-600" />;
              borderColor = 'border-emerald-300';
              bgColor = 'bg-emerald-50';
            } else if (step.status === 'unhandled') {
              icon = <AlertTriangle className="w-3 h-3 text-rose-600" />;
              borderColor = 'border-rose-300';
              bgColor = 'bg-rose-50';
            } else if (step.status === 'evaluating') {
              icon = <span className="w-2 h-2 rounded-full bg-lavender animate-pulse" />;
              borderColor = 'border-lavender/50';
              bgColor = 'bg-lavender/10';
            } else if (step.nodeId === 'client') {
              icon = <Send className="w-3 h-3 text-french" />;
            }

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border transition-all duration-300 ${borderColor} ${bgColor} ${
                  isCurrent ? 'ring-2 ring-lavender/60 shadow-sm' : 'opacity-90'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">{icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10px] text-french/70 mb-0.5">
                      <span className="font-bold text-french">
                        [Paso {idx + 1}] {step.nodeId.toUpperCase()}
                      </span>
                      <span className="text-lavender font-bold">
                        {step.status}
                      </span>
                    </div>
                    <p className="text-french text-[11px] leading-relaxed">
                      {step.message}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
