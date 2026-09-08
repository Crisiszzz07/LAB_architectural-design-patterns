import React from 'react';
import { RequestPayload, PresetChain, SimulationStep } from '../../types';
import { ButtonInButton } from '../layout/ButtonInButton';
import { InlineCodeViewer } from './InlineCodeViewer';
import { Send, Sparkles, Tag } from 'lucide-react';

interface RequestDispatcherProps {
  preset: PresetChain;
  currentValue: number;
  onValueChange: (val: number) => void;
  onRequestSelect: (req: RequestPayload) => void;
  onDispatch: () => void;
  isSimulating: boolean;
  currentStep: SimulationStep | null;
}

export const RequestDispatcher: React.FC<RequestDispatcherProps> = ({
  preset,
  currentValue,
  onValueChange,
  onRequestSelect,
  onDispatch,
  isSimulating,
  currentStep,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Selector de Casos de Ejemplo Rápidos */}
      <div>
        <label className="block text-[11px] uppercase tracking-wider font-bold text-french/80 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-lavender" />
          Ejemplos Preconfigurados para este Dominio:
        </label>
        <div className="flex flex-wrap gap-2">
          {preset.sampleRequests.map((req) => {
            const isSelected = currentValue === req.value;
            return (
              <button
                key={req.id}
                onClick={() => {
                  onValueChange(req.value);
                  onRequestSelect(req);
                }}
                disabled={isSimulating}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ease-spring flex items-center gap-1.5 cursor-pointer disabled:opacity-50 ${
                  isSelected
                    ? 'bg-lavender/25 text-french border-lavender shadow-sm font-bold'
                    : 'bg-porcelain hover:bg-bone/40 text-french/80 border-bone/80'
                }`}
              >
                <Tag className="w-3 h-3 text-lavender" />
                <span>{req.title}</span>
                <span className="font-mono text-[10px] bg-bone/70 px-1.5 py-0.5 rounded text-french font-bold">
                  {preset.unit === '$' ? `$${req.value.toLocaleString()}` : `${req.value} ${preset.unit}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Código Vivo Sincronizado en el Mismo Laboratorio (Directamente debajo de Ejemplos Preconfigurados) */}
      <InlineCodeViewer currentStep={currentStep} />

      {/* Controles de Valor y Lanzador */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-bone/30 p-4 rounded-2xl border border-bone/80">
        
        {/* Slider e Input */}
        <div className="md:col-span-8 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-french">
              {preset.inputLabel}:
            </span>
            <span className="font-mono text-sm font-bold text-french bg-porcelain px-2.5 py-1 rounded-lg border border-lavender/40 shadow-sm">
              {preset.unit === '$' ? `$${currentValue.toLocaleString()}` : `${currentValue} ${preset.unit}`}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min={preset.inputMin}
              max={preset.inputMax}
              step={preset.inputStep}
              value={currentValue}
              disabled={isSimulating}
              onChange={(e) => onValueChange(Number(e.target.value))}
              className="w-full h-2 bg-bone/80 rounded-lg appearance-none cursor-pointer accent-lavender focus:outline-none"
            />
            <input
              type="number"
              min={preset.inputMin}
              max={preset.inputMax}
              step={preset.inputStep}
              value={currentValue}
              disabled={isSimulating}
              onChange={(e) => onValueChange(Number(e.target.value))}
              className="w-24 bg-porcelain border border-bone rounded-xl px-2.5 py-1 text-right font-mono text-xs text-french font-bold focus:border-lavender focus:ring-1 focus:ring-lavender"
            />
          </div>
        </div>

        {/* Botón de Lanzamiento (Button-in-Button) */}
        <div className="md:col-span-4 flex justify-end">
          <ButtonInButton
            variant="primary"
            size="md"
            onClick={onDispatch}
            disabled={isSimulating}
            icon={<Send className="w-4 h-4 text-porcelain" />}
            className="w-full md:w-auto"
          >
            Emitir Petición
          </ButtonInButton>
        </div>

      </div>
    </div>
  );
};
