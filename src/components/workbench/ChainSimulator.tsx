import { referenceLines } from '../../data/codeTemplates';
import React, { useState, useEffect, useRef } from 'react';
import { 
  HandlerNode, 
  PresetChain, 
  RequestPayload, 
  SimulationStep 
} from '../../types';
import { PRESET_CHAINS } from '../../data/presets';
import { ChallengeChainView } from './ChallengeChainView';
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
  initialPreset?: PresetChain;
  lockDomain?: boolean;
  challengeView?: boolean;
  initialValue?: number;
  visible?: boolean;
  onConfigurationChange?: (handlers: HandlerNode[]) => void;
}

export const ChainSimulator: React.FC<ChainSimulatorProps> = ({ onStepChange, initialPreset = PRESET_CHAINS[0], onConfigurationChange, lockDomain = false, challengeView = false, initialValue, visible = true }) => {
  // Estado del preset activo
  const [activePreset, setActivePreset] = useState<PresetChain>(initialPreset);
  const [handlers, setHandlers] = useState<HandlerNode[]>(initialPreset.handlers);
  const [currentValue, setCurrentValue] = useState<number>(initialValue ?? initialPreset.sampleRequests[1].value);
  
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

  useEffect(() => { onConfigurationChange?.(handlers); }, [handlers, onConfigurationChange]);

  const timerRef = useRef<number | null>(null);

  useEffect(() => { if (!visible) setIsPlaying(false); }, [visible]);

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
      codeLineNumber: referenceLines('client_send'),
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
        codeLineNumber: referenceLines('eval_condition'),
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
          codeLineNumber: referenceLines('do_handle'),
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
            codeLineNumber: referenceLines('call_successor'),
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
            codeLineNumber: referenceLines('no_successor_sink'),
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
      if (visible && onStepChange) onStepChange(step);
      if (step.status === 'unhandled') {
        setIsFinishedUnhandled(true);
      } else {
        setIsFinishedUnhandled(false);
      }
    }
  }, [currentStepIndex, steps, onStepChange, visible]);

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

  if (challengeView) return <>
    <ChallengeChainView handlers={handlers} preset={activePreset} value={currentValue} currentStep={currentStep}
      steps={steps} stepIndex={currentStepIndex} playing={isPlaying}
      onValue={value => { resetSimulation(); setCurrentValue(value); }} onDispatch={handleDispatch}
      onPause={() => setIsPlaying(!isPlaying)} onNext={handleStepForward} onMove={moveHandler} onDelete={deleteHandler}
      onEdit={handler => { setIsCreatingNew(false); setEditingHandler(handler); setModalOpen(true); }}
      onAdd={() => { setIsCreatingNew(true); setEditingHandler(null); setModalOpen(true); }} onFallback={handleAddCatchAll} />
    <EditHandlerModal isOpen={modalOpen} isNew={isCreatingNew} unit={activePreset.unit} handler={editingHandler}
      onClose={() => setModalOpen(false)} onSave={handleSaveHandler} />
  </>;

  return (
    <div className="space-y-6">
      
      {/* Selector de Presets de Dominio */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-porcelain p-4 sm:p-5 rounded-3xl border border-bone shadow-sm">
        <div>
          <span className="text-[10px] font-mono tracking-widest uppercase text-lavender font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            {lockDomain ? 'Dominio de la misión' : 'Dominio de Arquitectura Activo'}
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
          {!lockDomain && PRESET_CHAINS.map((preset) => {
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
                        {isFinishedUnhandled ? 'Sin receptor' : 'Límite'}
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
                {activePreset.id === 'expense-approval' ? 'Mueve la Junta Directiva al inicio y compara quién responde a $350. Un umbral alto puede acaparar las solicitudes que cubre.' : activePreset.id === 'it-support' ? 'Mueve Nivel 3 al inicio y compara quién atiende una complejidad hipotética de 1. No es una escala real de severidad.' : 'Mueve el especialista de riesgo alto al inicio y compara quién revisa un puntaje de 10. Se elige al primer responsable capaz; no se aplican controles HTTP.'}
              </div>

              <div className="p-2.5 rounded-xl bg-bone/25 border border-bone">
                <span className="font-bold text-french block mb-1 text-[11px]">
                  2. Emisor desacoplado:
                </span>
                El cliente envía a la cabeza de la cadena; puede conocer su configuración, pero delega la selección del receptor definitivo.
              </div>

              <div className="p-2.5 rounded-xl bg-bone/25 border border-bone">
                <span className="font-bold text-french block mb-1 text-[11px]">
                  3. Riesgo de recepción:
                </span>
                {activePreset.id === 'expense-approval' ? 'Prueba $95.000: supera los límites de aprobación. Un terminal puede rechazar, registrar o escalar, sin aprobar todo.' : activePreset.id === 'it-support' ? 'Prueba complejidad 10: supera la capacidad de los niveles estándar. Considera una política de escalamiento o respuesta explícita.' : 'Prueba riesgo 98: ningún responsable estándar tiene capacidad. Para estudiar middleware de continuar/rechazar, abre la misión Seguridad ERP.'}
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
