import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Gauge
} from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  canStepForward: boolean;
  canStepBackward: boolean;
  currentStepIndex: number;
  totalSteps: number;
  speed: number;
  onPlayPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  canStepForward,
  canStepBackward,
  currentStepIndex,
  totalSteps,
  speed,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-bone/30 p-3 rounded-2xl border border-bone/80">
      
      {/* Botones de Control Paso a Paso */}
      <div className="flex items-center gap-2">
        {/* Reset */}
        <button
          onClick={onReset}
          className="w-8 h-8 rounded-full bg-porcelain hover:bg-bone/40 border border-bone flex items-center justify-center text-french hover:text-darkFrench transition-all cursor-pointer shadow-sm"
          title="Reiniciar simulación"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Step Backward */}
        <button
          onClick={onStepBackward}
          disabled={!canStepBackward}
          className="w-8 h-8 rounded-full bg-porcelain hover:bg-bone/40 border border-bone flex items-center justify-center text-french hover:text-darkFrench transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          title="Paso anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Play / Pause Principal */}
        <button
          onClick={onPlayPause}
          disabled={totalSteps === 0}
          className={`px-4 py-1.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all duration-300 ease-spring shadow-sm cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
            isPlaying
              ? 'bg-french hover:bg-darkFrench text-porcelain shadow-sm'
              : 'bg-lavender hover:opacity-90 text-porcelain shadow-sm'
          }`}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Pausar</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Reproducir</span>
            </>
          )}
        </button>

        {/* Step Forward */}
        <button
          onClick={onStepForward}
          disabled={!canStepForward}
          className="w-8 h-8 rounded-full bg-porcelain hover:bg-bone/40 border border-bone flex items-center justify-center text-french hover:text-darkFrench transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-sm"
          title="Siguiente paso"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Indicador de Pasos y Velocidad */}
      <div className="flex items-center gap-4">
        {/* Contador de Pasos */}
        <div className="text-xs font-mono text-french/80">
          Paso: <span className="text-lavender font-bold">{totalSteps > 0 ? currentStepIndex + 1 : 0}</span> / {totalSteps}
        </div>

        {/* Selector de Velocidad */}
        <div className="flex items-center gap-1 bg-bone/50 p-1 rounded-full border border-bone">
          <Gauge className="w-3.5 h-3.5 text-french/70 ml-1.5 mr-0.5" />
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono transition-all cursor-pointer ${
                speed === s
                  ? 'bg-porcelain text-french border border-lavender/40 shadow-sm font-bold'
                  : 'text-french/70 hover:text-french'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
