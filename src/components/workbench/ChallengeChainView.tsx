import { useId } from 'react';
import { ArrowDown, ArrowUp, Play, Pause, Plus, Settings2, Trash2, ChevronRight, BriefcaseBusiness } from 'lucide-react';
import { HandlerNode, PresetChain, SimulationStep } from '../../types';

interface Props {
  handlers: HandlerNode[];
  preset: PresetChain;
  value: number;
  currentStep: SimulationStep | null;
  steps: SimulationStep[];
  stepIndex: number;
  playing: boolean;
  onValue: (value: number) => void;
  onDispatch: () => void;
  onPause: () => void;
  onNext: () => void;
  onMove: (index: number, direction: 'left' | 'right') => void;
  onEdit: (handler: HandlerNode) => void;
  onDelete: (index: number) => void;
  onAdd: () => void;
  onFallback: () => void;
}

export function ChallengeChainView(props: Props) {
  const requestId = useId();
  const { handlers, preset, value, currentStep, steps, stepIndex, playing } = props;
  return <section className="op-workspace" aria-label="Cadena de la misión">
    <div className="op-section-head"><div><h3>Cadena de aprobación</h3><p>Dominio de la misión · Gastos empresariales</p></div><button className="op-button op-button-quiet" onClick={props.onAdd} disabled={playing}><Plus size={16} aria-hidden="true" />Añadir eslabón</button></div>
    <div className="op-dispatch">
      <label className="op-label" htmlFor={requestId}>Solicitud de prueba
        <select id={requestId} className="op-input" value={value} disabled={playing} onChange={e => props.onValue(Number(e.target.value))}>
          {preset.sampleRequests.map(req => <option key={req.id} value={req.value}>${req.value.toLocaleString('es-CO')} · {req.title}</option>)}
        </select>
      </label>
      <button className="op-button" onClick={props.onDispatch} disabled={playing}><Play size={16} aria-hidden="true" />Simular petición</button>
    </div>
    <div className="op-chain-origin"><span>Cliente</span><code>head.handleRequest(${value.toLocaleString('es-CO')})</code></div>
    <ol className="op-chain">
      {handlers.map((handler, index) => {
        const step = currentStep?.nodeId === handler.id ? currentStep : null;
        const status = step?.status === 'handled' ? 'Atendida' : step?.status === 'evaluating' ? 'Evaluando' : step?.status === 'delegating' ? 'Delega al sucesor' : 'En espera';
        return <li key={handler.id} className={`op-node ${step ? `op-node-${step.status}` : ''}`}>
          <span className="op-node-number">{index + 1}<BriefcaseBusiness size={18} aria-hidden="true" /></span>
          <div className="op-node-body"><strong>{handler.name}</strong><div className="op-node-meta"><code>monto {handler.operator === 'lte' ? '≤' : handler.operator === 'gte' ? '≥' : '='} ${handler.threshold.toLocaleString('es-CO')}</code><span className="op-node-state">{status}</span></div></div>
          <div className="op-node-actions">
            <button className="op-icon-button" aria-label={`Mover ${handler.name} antes`} disabled={playing || index === 0} onClick={() => props.onMove(index, 'left')}><ArrowUp size={16} aria-hidden="true" /></button>
            <button className="op-icon-button" aria-label={`Mover ${handler.name} después`} disabled={playing || index === handlers.length - 1} onClick={() => props.onMove(index, 'right')}><ArrowDown size={16} aria-hidden="true" /></button>
            <button className="op-icon-button" aria-label={`Editar ${handler.name}`} disabled={playing} onClick={() => props.onEdit(handler)}><Settings2 size={16} aria-hidden="true" /></button>
            <button className="op-icon-button" aria-label={`Eliminar ${handler.name}`} disabled={playing || handlers.length <= 1} onClick={() => props.onDelete(index)}><Trash2 size={16} aria-hidden="true" /></button>
          </div>
        </li>;
      })}
    </ol>
    <div className="op-trace" aria-live="polite"><div className="op-section-head"><h4>Traza de ejecución</h4><div className="op-actions"><span className="op-small">{steps.length ? `${stepIndex + 1}/${steps.length}` : 'Sin ejecutar'}</span><button className="op-icon-button" aria-label={playing ? 'Pausar ejecución' : 'Continuar ejecución'} disabled={!steps.length || stepIndex >= steps.length - 1} onClick={props.onPause}>{playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}</button><button className="op-icon-button" aria-label="Siguiente paso" disabled={playing || !steps.length || stepIndex >= steps.length - 1} onClick={props.onNext}><ChevronRight size={16} aria-hidden="true" /></button></div></div>
      <p className="op-route">Recorrido: {steps.length ? handlers.filter(h => steps.slice(0, stepIndex + 1).some(s => s.nodeId === h.id)).map(h => h.name).join(' → ') : 'Sin simular'}</p>
      <p className="op-context">{currentStep?.message ?? 'Simula una solicitud para observar quién evalúa, delega o atiende.'}</p>
      {currentStep?.status === 'unhandled' && <button className="op-button" onClick={props.onFallback}><Plus size={16} aria-hidden="true" />Añadir fallback</button>}
    </div>
  </section>;
}
