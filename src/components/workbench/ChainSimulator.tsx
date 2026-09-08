import React, { useState, useEffect, useRef } from 'react';
import { 
  HandlerNode, 
  PresetChain, 
  RequestPayload, 
  SimulationStep 
} from '../../types';
import { PRESET_CHAINS } from '../../data/presets';
import { HandlerNodeView } from './HandlerNodeView';
import { RequestDispatcher } from './RequestDispatcher';
import { PlaybackControls } from './PlaybackControls';
import { ExecutionLog } from './ExecutionLog';
import { UnhandledAlert } from './UnhandledAlert';
import { EditHandlerModal } from './EditHandlerModal';
import { DoubleBezelCard } from '../layout/DoubleBezelCard';
import { 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Info,
} from 'lucide-react';

interface ChainSimulatorProps {
  onStepChange?: (step: SimulationStep | null) => void;
}

export const ChainSimulator: React.FC<ChainSimulatorProps> = ({ onStepChange }) => {
  // Estado del preset activo
  const [activePreset, setActivePreset] = useState<PresetChain>(PRESET_CHAINS[0]);
  const [handlers, setHandlers] = useState<HandlerNode[]>(PRESET_CHAINS[0].handlers);
  const [currentValue, setCurrentValue] = useState<number>(PRESET_CHAINS[0].sampleRequests[1].value);
  
  // Estado de simulación
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [isFinishedUnhandled, setIsFinishedUnhandled] = useState<boolean>(false);

  // Modal de edición de eslabón
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHandler, setEditingHandler] = useState<HandlerNode | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const timerRef = useRef<number | null>(null);

  // Al cambiar de preset, cargar sus datos
  const handlePresetSelect = (preset: PresetChain) => {
    setActivePreset(preset);
    setHandlers([...preset.handlers]);
    setCurrentValue(preset.sampleRequests[1].value);
    resetSimulation();
  };

  // Generar la secuencia de pasos de la simulación
  const generateSteps = (value: number, currentHandlers: HandlerNode[]): SimulationStep[] => {
    const generated: SimulationStep[] = [];

    // Paso 0: Cliente emite
    generated.push({
      stepIndex: 0,
      nodeId: 'client',
      status: 'transiting',
      message: `Cliente inicializa solicitud con valor ${activePreset.unit === '$' ? '$' + value.toLocaleString() : value + ' ' + activePreset.unit} y la envía a la cabeza de la cadena.`,
      codeLineKey: 'client_send',
      codeLineNumber: { java: 37, typescript: 33, python: 28, go: 42 },
      passedCondition: null,
    });

    let handled = false;

    for (let i = 0; i < currentHandlers.length; i++) {
      const h = currentHandlers[i];
      let canHandle = false;

      if (h.operator === 'lte') canHandle = value <= h.threshold;
      else if (h.operator === 'gte') canHandle = value >= h.threshold;
      else if (h.operator === 'eq') canHandle = value === h.threshold;

      // Paso: Evaluación
      generated.push({
        stepIndex: generated.length,
        nodeId: h.id,
        status: 'evaluating',
        message: `[${h.name}] Evaluando canHandle(request): ¿${value} ${h.operator === 'lte' ? '≤' : h.operator === 'gte' ? '≥' : '=='} ${h.threshold}? -> ${canHandle ? 'VERDADERO' : 'FALSO'}`,
        codeLineKey: 'eval_condition',
        codeLineNumber: { java: 12, typescript: 11, python: 12, go: 23 },
        passedCondition: canHandle,
      });

      if (canHandle) {
        // Paso: Atendido
        generated.push({
          stepIndex: generated.length,
          nodeId: h.id,
          status: 'handled',
          message: `[${h.name}] ¡Condición cumplida! Procesa la solicitud: "${h.actionSummary}". Fin de la cadena.`,
          codeLineKey: 'do_handle',
          codeLineNumber: { java: 13, typescript: 12, python: 13, go: 24 },
          passedCondition: true,
        });
        handled = true;
        break; // CoR clásico: un manejador atiende y frena
      } else {
        // Paso: Delegación a sucesor o Fin
        if (i < currentHandlers.length - 1) {
          const nextH = currentHandlers[i + 1];
          generated.push({
            stepIndex: generated.length,
            nodeId: h.id,
            status: 'delegating',
            message: `[${h.name}] No cumple la condición. Delegando en el sucesor (${nextH.name}).`,
            codeLineKey: 'call_successor',
            codeLineNumber: { java: 15, typescript: 14, python: 15, go: 28 },
            passedCondition: false,
          });
        } else {
          // Último eslabón sin sucesor
          generated.push({
            stepIndex: generated.length,
            nodeId: 'sink',
            status: 'unhandled',
            message: `[${h.name}] Sucesor es nulo (next == null). La petición superó todos los eslabones sin ser resuelta. Riesgo GoF: "Receipt is not guaranteed".`,
            codeLineKey: 'no_successor_sink',
            codeLineNumber: { java: 18, typescript: 17, python: 18, go: 31 },
            passedCondition: false,
          });
        }
      }
    }

    return generated;
  };

  // Disparar la simulación
  const handleDispatch = () => {
    resetSimulation();
    const newSteps = generateSteps(currentValue, handlers);
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  // Reiniciar estado
  const resetSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setSteps([]);
    setIsFinishedUnhandled(false);
    if (onStepChange) onStepChange(null);
  };

  // Ciclo de animación automático
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const intervalMs = Math.max(400, 1400 / speed);
      timerRef.current = window.setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, speed]);

  // Notificar al visor de código sincronizado en cada paso
  useEffect(() => {
    if (currentStepIndex >= 0 && currentStepIndex < steps.length) {
      const step = steps[currentStepIndex];
      if (onStepChange) onStepChange(step);
      if (step.status === 'unhandled') {
        setIsFinishedUnhandled(true);
      } else {
        setIsFinishedUnhandled(false);
      }
    }
  }, [currentStepIndex, steps, onStepChange]);

  // Manejo de controles manuales
  const handleStepForward = () => {
    if (steps.length === 0) {
      const newSteps = generateSteps(currentValue, handlers);
      setSteps(newSteps);
      setCurrentStepIndex(0);
    } else if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // Reordenamiento de manejadores
  const moveHandler = (index: number, direction: 'left' | 'right') => {
    resetSimulation();
    const newHandlers = [...handlers];
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newHandlers.length) return;
    const temp = newHandlers[index];
    newHandlers[index] = newHandlers[targetIndex];
    newHandlers[targetIndex] = temp;
    setHandlers(newHandlers);
  };

  const deleteHandler = (index: number) => {
    resetSimulation();
    if (handlers.length <= 1) return;
    setHandlers(handlers.filter((_, i) => i !== index));
  };

  const handleSaveHandler = (saved: HandlerNode) => {
    resetSimulation();
    if (isCreatingNew) {
      setHandlers([...handlers, saved]);
    } else {
      setHandlers(handlers.map((h) => (h.id === saved.id ? saved : h)));
    }
  };

  // Añadir manejador Catch-All defensivo cuando ocurre Unhandled
  const handleAddCatchAll = () => {
    const catchAll: HandlerNode = {
      id: `h-catchall-${Date.now()}`,
      name: 'Comité de Excepción / Fallback',
      role: 'Default Fallback Handler',
      operator: 'gte',
      threshold: 0,
      unit: activePreset.unit,
      canHandleConditionText: 'Cualquier solicitud no atendida (Default)',
      description: 'Manejador terminal para evitar peticiones huérfanas en el sistema.',
      actionSummary: 'Registra en log de auditoría y remite a revisión de emergencia.',
      stopOnHandle: true,
      avatarIcon: 'ShieldAlert',
    };
    setHandlers([...handlers, catchAll]);
    resetSimulation();
  };

  // Información del paso actual
  const currentStep = currentStepIndex >= 0 ? steps[currentStepIndex] : null;

  return (
    <div className="space-y-6">
      
      {/* Selector de Presets de Dominio */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-porcelain p-4 sm:p-5 rounded-3xl border border-bone shadow-sm">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-lavender font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Dominio de Arquitectura Activo
          </span>
          <h2 className="text-lg font-bold text-french">
            {activePreset.title}
          </h2>
          <p className="text-xs text-french/70 mt-0.5">
            {activePreset.description}
          </p>
        </div>

        {/* Botones de Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESET_CHAINS.map((preset) => {
            const isSelected = activePreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handlePresetSelect(preset)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 ease-spring cursor-pointer ${
                  isSelected
                    ? 'bg-lavender/25 text-french border-lavender shadow-sm font-bold'
                    : 'bg-porcelain hover:bg-bone/40 text-french/80 border-bone'
                }`}
              >
                {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid Principal del Laboratorio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Panel Izquierdo / Superior: Lienzo de la Cadena y Manejadores (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <DoubleBezelCard innerClassName="p-5 sm:p-6">
            
            {/* Header del Lienzo */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-bone/60 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-lavender animate-ping" />
                  <h3 className="font-bold text-sm text-french uppercase tracking-wide font-mono">
                    Lienzo de la Cadena de Responsabilidad
                  </h3>
                </div>
                <p className="text-xs text-french/70 mt-1">
                  Reordena los eslabones para experimentar cómo el orden altera el procesamiento.
                </p>
              </div>

              {/* Acciones del Lienzo */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsCreatingNew(true);
                    setEditingHandler(null);
                    setModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-full bg-porcelain hover:bg-bone/40 text-french border border-bone text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 text-lavender" />
                  <span>Añadir Eslabón</span>
                </button>

                <button
                  onClick={() => handlePresetSelect(activePreset)}
                  className="px-3 py-1.5 rounded-full bg-porcelain hover:bg-bone/40 border border-bone text-xs font-semibold text-french/70 hover:text-french flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  title="Restablecer cadena original"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Restablecer</span>
                </button>
              </div>
            </div>

            {/* Visual Flow Canvas de Manejadores */}
            <div className="relative overflow-x-auto pb-4 pt-2">
              <div className="flex flex-col md:flex-row items-center md:items-stretch min-w-max gap-3 md:gap-0">
                
                {/* Emisor / Cliente */}
                <div className="flex flex-col md:flex-row items-center">
                  <div className="bg-bone/60 ring-1 ring-lilac/30 p-1.5 rounded-[1.5rem] w-48 text-center shrink-0">
                    <div className="bg-porcelain p-3.5 rounded-[calc(1.5rem-0.375rem)] shadow-sm">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-lavender font-bold block mb-1">
                        Emisor (Client)
                      </span>
                      <p className="font-bold text-xs text-french">
                        Dispatch Controller
                      </p>
                      <div className="mt-2 text-[10px] text-french font-mono bg-bone/35 py-1 px-2 rounded-lg border border-bone/70 font-semibold">
                        req = {activePreset.unit === '$' ? `$${currentValue.toLocaleString()}` : `${currentValue} ${activePreset.unit}`}
                      </div>
                    </div>
                  </div>

                  {/* Conector desde Cliente hacia el primer eslabón */}
                  <div className="flex items-center justify-center my-2 md:my-0 md:mx-3 text-french shrink-0">
                    <div className="h-0.5 w-6 bg-lilac/50 hidden md:block" />
                    <span className="text-french font-mono text-[10px] font-bold hidden md:inline ml-1 mr-1">
                      head.handle()
                    </span>
                  </div>
                </div>

                {/* Lista de Eslabones (Concrete Handlers) */}
                {handlers.map((handler, idx) => {
                  const isActive = currentStep?.nodeId === handler.id;
                  const isEvaluating = isActive && currentStep?.status === 'evaluating';
                  const isHandled = isActive && currentStep?.status === 'handled';
                  const isDelegated = isActive && currentStep?.status === 'delegating';

                  return (
                    <HandlerNodeView
                      key={handler.id}
                      handler={handler}
                      index={idx}
                      totalHandlers={handlers.length}
                      isActive={isActive}
                      isEvaluating={isEvaluating}
                      isHandled={isHandled}
                      isDelegated={isDelegated}
                      disabledActions={isPlaying}
                      onMoveLeft={() => moveHandler(idx, 'left')}
                      onMoveRight={() => moveHandler(idx, 'right')}
                      onEdit={() => {
                        setIsCreatingNew(false);
                        setEditingHandler(handler);
                        setModalOpen(true);
                      }}
                      onDelete={() => deleteHandler(idx)}
                    />
                  );
                })}

                {/* Sink / Fin de la cadena */}
                <div className="flex flex-col md:flex-row items-center ml-2">
                  <div
                    className={`ring-1 p-1.5 rounded-[1.5rem] w-36 text-center shrink-0 transition-all duration-500 ${
                      isFinishedUnhandled
                        ? 'bg-rose-100 ring-rose-400 shadow-md'
                        : 'bg-bone/50 ring-1 ring-lilac/30'
                    }`}
                  >
                    <div className="bg-porcelain p-3 rounded-[calc(1.5rem-0.375rem)] shadow-sm">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-french/60 block mb-1 font-semibold">
                        Fin / Sink
                      </span>
                      <p className="font-semibold text-xs text-french">
                        successor == null
                      </p>
                      <span
                        className={`inline-block mt-1 text-[9px] font-mono px-1.5 py-0.5 rounded ${
                          isFinishedUnhandled
                            ? 'bg-rose-100 text-rose-800 font-bold'
                            : 'bg-bone/40 text-french/70'
                        }`}
                      >
                        {isFinishedUnhandled ? '¡Caída GoF!' : 'Límite'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Alerta de Solicitud Caída ("Receipt is not guaranteed") */}
            {isFinishedUnhandled && (
              <UnhandledAlert
                requestValue={currentValue}
                unit={activePreset.unit}
                onAddCatchAllHandler={handleAddCatchAll}
              />
            )}

          </DoubleBezelCard>

          {/* Panel de Inyección de Solicitud y Playback Controls */}
          <DoubleBezelCard innerClassName="p-5 sm:p-6">
            <div className="space-y-4">
              <RequestDispatcher
                preset={activePreset}
                currentValue={currentValue}
                onValueChange={setCurrentValue}
                onRequestSelect={(req) => setCurrentValue(req.value)}
                onDispatch={handleDispatch}
                isSimulating={isPlaying}
                currentStep={currentStep}
              />

              <PlaybackControls
                isPlaying={isPlaying}
                canStepForward={currentStepIndex < steps.length - 1}
                canStepBackward={currentStepIndex > 0}
                currentStepIndex={currentStepIndex}
                totalSteps={steps.length}
                speed={speed}
                onPlayPause={() => setIsPlaying(!isPlaying)}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onReset={resetSimulation}
                onSpeedChange={setSpeed}
              />
            </div>
          </DoubleBezelCard>

        </div>

        {/* Panel Derecho: Telemetría y Notas de Arquitectura (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Registro de Telemetría */}
          <div className="h-80">
            <ExecutionLog
              steps={steps}
              currentStepIndex={currentStepIndex}
            />
          </div>

          {/* Tarjeta Didáctica: Principios de Diseño en este Paso */}
          <DoubleBezelCard innerClassName="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-4 h-4 text-lavender" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-french font-mono">
                Laboratorio GoF • Guía de Estudio
              </h4>
            </div>

            <div className="space-y-3 text-xs text-french/80 leading-relaxed">
              <div className="p-2.5 rounded-xl bg-bone/25 border border-bone">
                <span className="font-bold text-french block mb-1 text-[11px]">
                  1. Experimenta con el orden:
                </span>
                Prueba mover un eslabón con umbral alto al principio. Notarás cómo "acapara" todas las peticiones, impidiendo que los eslabones menores se ejecuten.
              </div>

              <div className="p-2.5 rounded-xl bg-bone/25 border border-bone">
                <span className="font-bold text-french block mb-1 text-[11px]">
                  2. Emisor desacoplado:
                </span>
                Observa que el Cliente nunca invoca <code className="text-french font-mono font-bold bg-porcelain px-1 py-0.5 rounded border border-bone">cfo.approve()</code> directamente; solo habla con el primer eslabón disponible.
              </div>

              <div className="p-2.5 rounded-xl bg-bone/25 border border-bone">
                <span className="font-bold text-french block mb-1 text-[11px]">
                  3. Riesgo de recepción:
                </span>
                Ingresa un valor mayor al máximo (ej. $90,000) y verás la petición caer al final. ¡Ese es el riesgo clásico del patrón!
              </div>
            </div>
          </DoubleBezelCard>

        </div>

      </div>

      {/* Modal para Editar / Crear Manejador */}
      <EditHandlerModal
        isOpen={modalOpen}
        isNew={isCreatingNew}
        unit={activePreset.unit}
        handler={editingHandler}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveHandler}
      />

    </div>
  );
};
