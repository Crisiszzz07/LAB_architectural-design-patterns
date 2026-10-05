/* Hallmark · pre-emit critique: P5 H5 E4 S5 R5 V5 */
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronDown, Circle, FlaskConical, Pencil, RotateCcw, XCircle } from 'lucide-react';
import { ChainSimulator } from './ChainSimulator';
import { HttpChallengePipeline } from './HttpChallengePipeline';
import { PRESET_CHAINS } from '../../data/presets';
import { HandlerNode, SimulationStep } from '../../types';
import { ActiveTab } from '../layout/Navbar';
import { Filter, httpRequests, receiver, runHttp } from './operationRules';
import { isHandlerList, isString, useActivityState } from './useActivityState';

const base = PRESET_CHAINS[0];
const rounds = [
  { title: 'El eslabón acaparador', short: 'Acaparamiento', mission: 'Las compras pequeñas llegan a la Junta Directiva. Reordenen la cadena para recuperar la responsabilidad de cada nivel.', labels: ['Conservar responsables y límites', 'Ordenar por autoridad creciente', 'Resolver los cuatro montos'], hint: 'El primer manejador capaz de atender detiene la cadena. Comparen qué ocurre con $350 cuando el límite más alto aparece al inicio.', preset: { ...base, handlers: [base.handlers[3], ...base.handlers.slice(0, 3)] }, value: 350 },
  { title: 'Responde fuera de rango', short: 'Sin receptor', mission: 'Una compra de $95.000 supera todos los límites. Observen dónde termina y configuren una respuesta explícita.', labels: ['Conservar la cadena original', 'Cubrir solicitudes fuera de rango', 'Elegir una política terminal'], hint: 'Un fallback al final puede registrar y derivar, rechazar explícitamente o escalar. Editen su acción para reflejar la decisión del equipo.', preset: base, value: 95000 },
  { title: 'Protege el ERP', short: 'Seguridad ERP', mission: 'Reparen el pipeline para verificar permisos antes de procesar compras y registrar también los rechazos.', labels: ['Autenticar antes de procesar', 'Auditar todos los resultados', 'Responder las tres peticiones'], hint: 'Auditoría puede envolver la llamada al sucesor y registrar su respuesta al regresar. Una validación correcta delega; una inválida detiene.', preset: base, value: 0 },
];
const brokenHttp: Filter[] = ['ERP', 'Autorización', 'Autenticación', 'Auditoría'];
interface Evidence { request: string; handler: string; result: string; valid: boolean }
interface Criterion { passed: boolean; detail: string }
interface Submission { explanation: string; order: string; impact: string }
const isEvidence = (v: unknown): v is Evidence[] => Array.isArray(v) && v.length <= 4 && v.every(f => f && typeof f.request === 'string' && typeof f.handler === 'string' && typeof f.result === 'string' && typeof f.valid === 'boolean');
const isCriteria = (v: unknown): v is Criterion[] => Array.isArray(v) && (v.length === 0 || v.length === 3) && v.every(c => c && typeof c.passed === 'boolean' && typeof c.detail === 'string');
const isChain = (v: unknown): v is Filter[] => Array.isArray(v) && v.length === 4 && new Set(v).size === 4 && v.every(f => brokenHttp.includes(f));
const isSubmission = (v: unknown): v is Submission | null => v === null || typeof v === 'object' && ['explanation', 'order', 'impact'].every(key => typeof (v as Record<string, unknown>)[key] === 'string');

function MissionRound({ index, visible, onStepChange, onNavigate, onNext }: { index: number; visible: boolean; onStepChange: (step: SimulationStep | null) => void; onNavigate: (tab: ActiveTab) => void; onNext: () => void }) {
  const mission = rounds[index];
  const [attempt, setAttempt] = useState(0);
  const [handlers, setHandlers, handlersStored] = useActivityState(`round-${index}:handlers`, mission.preset.handlers, isHandlerList);
  const [chain, setChain, chainStored] = useActivityState(`round-${index}:http`, brokenHttp, isChain);
  const [evidence, setEvidence, evidenceStored] = useActivityState<Evidence[]>(`round-${index}:evidence`, [], isEvidence);
  const [criteria, setCriteria, criteriaStored] = useActivityState<Criterion[]>(`round-${index}:criteria`, [], isCriteria);
  const [policy, setPolicy, policyStored] = useActivityState(`round-${index}:policy`, '', isString);
  const [explanation, setExplanation, explanationStored] = useActivityState(`round-${index}:explanation`, '', isString);
  const [order, setOrder, orderStored] = useActivityState(`round-${index}:order`, '', isString);
  const [impact, setImpact, impactStored] = useActivityState(`round-${index}:impact`, '', isString);
  const [submission, setSubmission, submissionStored] = useActivityState<Submission | null>(`round-${index}:submission`, null, isSubmission);
  const [savedMessage, setSavedMessage] = useState('');
  const [defenseOpen, setDefenseOpen] = useState(false);
  const [missionOpen, setMissionOpen] = useState(false);
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 64rem)').matches);
  const configuration = useRef(handlers);
  const id = useId();
  const stored = [handlersStored, chainStored, evidenceStored, criteriaStored, policyStored, explanationStored, orderStored, impactStored, submissionStored].every(Boolean);
  const passedCount = criteria.filter(c => c.passed).length;
  const passed = criteria.length === 3 && passedCount === 3;
  useEffect(() => {
    const query = window.matchMedia('(min-width: 64rem)');
    const change = () => setWide(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  const invalidate = useCallback(() => { setCriteria([]); setEvidence([]); setSubmission(null); setSavedMessage(''); setDefenseOpen(false); }, [setCriteria, setEvidence, setSubmission]);
  const changed = useCallback((next: HandlerNode[]) => {
    if (JSON.stringify(configuration.current) === JSON.stringify(next)) return;
    configuration.current = next; setHandlers(next); invalidate();
  }, [setHandlers, invalidate]);
  const reset = () => {
    configuration.current = mission.preset.handlers; setHandlers(mission.preset.handlers); setChain([...brokenHttp]);
    setAttempt(a => a + 1); invalidate(); onStepChange(null);
  };
  function verify() {
    let findings: Evidence[];
    let checks: Criterion[];
    if (index === 0) {
      const values = [350, 2200, 8500, 32000];
      findings = values.map((value, i) => { const h = receiver(handlers, value); return { request: `$${value.toLocaleString('es-CO')}`, handler: h?.name ?? 'Sin receptor', result: h ? 'Atendida' : 'Sin respuesta', valid: h?.id === base.handlers[i].id }; });
      const original = handlers.length === 4 && base.handlers.every(h => handlers.some(next => next.id === h.id && next.threshold === h.threshold && next.operator === h.operator));
      const ascending = handlers.length === 4 && base.handlers.every((h, i) => handlers[i]?.id === h.id);
      const correct = findings.filter(f => f.valid).length;
      checks = [{ passed: original, detail: original ? 'Los cuatro responsables mantienen sus límites.' : 'Se modificó o eliminó un responsable o su límite.' }, { passed: ascending, detail: ascending ? 'La autoridad aumenta al avanzar por los sucesores.' : 'El orden todavía permite acaparamiento o saltos de autoridad.' }, { passed: correct === 4, detail: `${correct} de 4 montos llegaron al responsable esperado.` }];
    } else if (index === 1) {
      const last = handlers[handlers.length - 1]; const target = receiver(handlers, 95000);
      const original = handlers.length === 5 && base.handlers.every((h, i) => handlers[i]?.id === h.id && handlers[i]?.threshold === h.threshold && handlers[i]?.operator === h.operator);
      const covered = handlers.length > 4 && target?.id === last?.id && last?.operator === 'gte' && last.threshold <= 0;
      checks = [{ passed: original, detail: original ? 'La cadena original precede al manejador terminal.' : 'Falta conservar los cuatro responsables antes del fallback.' }, { passed: covered, detail: covered ? '$95.000 tiene un receptor terminal; se cubren los montos positivos.' : '$95.000 no tiene un fallback final que cubra el rango completo.' }, { passed: !!policy, detail: policy ? `${policy}. La coherencia con su acción se revisa en la defensa.` : 'El equipo aún no eligió qué responder fuera de rango.' }];
      findings = [{ request: '$95.000', handler: target?.name ?? 'Sin receptor', result: target?.actionSummary ?? 'Recepción no garantizada', valid: checks.every(c => c.passed) }];
    } else {
      const runs = httpRequests.map(req => runHttp(chain, req));
      findings = runs.map((run, i) => ({ request: httpRequests[i].title, handler: run.handler, result: `HTTP ${run.status || 'sin respuesta'} · ${run.audited ? 'Auditada' : 'Sin auditoría'}${run.safe ? '' : ' · Acceso sin verificar'}`, valid: run.status === httpRequests[i].expected && run.safe }));
      const ordered = chain.indexOf('Autenticación') < chain.indexOf('Autorización') && chain.indexOf('Autorización') < chain.indexOf('ERP');
      const audits = runs.filter(run => run.audited).length; const correct = findings.filter(f => f.valid).length;
      checks = [{ passed: ordered, detail: ordered ? 'Token y rol se verifican antes de llegar al ERP.' : 'El ERP o la autorización aparecen antes de los controles necesarios.' }, { passed: audits === 3, detail: `Auditoría: ${audits} de 3 peticiones registradas.` }, { passed: correct === 3, detail: `${correct} de 3 respuestas coinciden con 401, 403 y 200 sin accesos inseguros.` }];
    }
    setEvidence(findings); setCriteria(checks); setSavedMessage('');
  }
  const complete = !!explanation.trim() && !!order.trim() && !!impact.trim();
  const dirty = !!submission && (explanation !== submission.explanation || order !== submission.order || impact !== submission.impact);
  const save = () => { setSubmission({ explanation, order, impact }); setSavedMessage(stored ? 'Solución guardada en este navegador. Explicación pendiente de revisión docente.' : 'El navegador no permite guardar. Mantén esta pestaña abierta para conservar el trabajo.'); };
  return <>
    <div className="op-repair-desk">
      <details className="op-mission-sheet" open={wide || missionOpen} onToggle={e => { if (!wide) setMissionOpen(e.currentTarget.open); }}>
        <summary><span>Misión {index + 1}</span><strong>{mission.title}</strong><ChevronDown size={16} aria-hidden="true" /></summary>
        <div className="op-mission-content"><h3>{mission.title}</h3><p>{mission.mission}</p>
          <ul className="op-progress">{mission.labels.map((label, i) => { const result = criteria[i]; const Icon = !result ? Circle : result.passed ? CheckCircle2 : XCircle; return <li key={label} data-state={!result ? 'pending' : result.passed ? 'passed' : 'failed'}><Icon size={17} aria-hidden="true" /><div><strong>{label}</strong><p>{result?.detail ?? 'Pendiente de validar'}</p></div></li>; })}</ul>
          {index === 1 && <label className="op-label" htmlFor={`${id}-policy`}>Respuesta fuera de rango<select id={`${id}-policy`} className="op-input" value={policy} onChange={e => { setPolicy(e.target.value); invalidate(); }}><option value="">Elegir política</option><option>Registrar y derivar a revisión</option><option>Rechazar explícitamente</option><option>Escalar a una autoridad externa</option></select></label>}
          <details className="op-details"><summary>Pista disponible</summary><p>{mission.hint}</p></details>
          <details className="op-details"><summary>Rúbrica y roles</summary><p>10 puntos por configuración; receptor, orden y consecuencia, hasta 5 cada uno tras revisión docente. Roten operador, analista y portavoz.</p></details>
          <button className="op-button op-button-quiet" onClick={reset}><RotateCcw size={15} aria-hidden="true" />Restaurar falla</button>
        </div>
      </details>
      <div className="op-canvas">
        {index < 2 ? <ChainSimulator key={attempt} challengeView lockDomain initialPreset={{ ...mission.preset, handlers }} initialValue={mission.value} visible={visible} onStepChange={onStepChange} onConfigurationChange={changed} /> : <HttpChallengePipeline key={attempt} chain={chain} visible={visible} onChange={next => { setChain(next); invalidate(); }} />}
        <div className="op-validation"><button className="op-button op-button-primary" onClick={verify}><FlaskConical size={16} aria-hidden="true" />Validar las 3 pruebas</button><span role="status"><strong>{passedCount}/3</strong> pruebas superadas</span></div>
        {evidence.length > 0 && <section className="op-evidence" aria-label="Resultados de las pruebas"><div className="op-section-head"><h4>Resultados de las pruebas</h4><span className="op-small">{passed ? 'Reparación validada' : 'Revisen los criterios de la misión'}</span></div><table className="op-test-table"><thead><tr><th scope="col">Solicitud</th><th scope="col">Quién respondió</th><th scope="col">Resultado observado</th></tr></thead><tbody>{evidence.map(f => <tr key={f.request}><th scope="row">{f.request}</th><td data-label="Quién respondió">{f.handler}</td><td data-label="Resultado">{f.result}</td></tr>)}</tbody></table></section>}
        {passed && <details className="op-defense" open={defenseOpen} onToggle={e => setDefenseOpen(e.currentTarget.open)}><summary><CheckCircle2 size={17} aria-hidden="true" /><strong>Reparación lista · explicar solución</strong><ChevronDown size={16} aria-hidden="true" /></summary><form onSubmit={e => { e.preventDefault(); if (complete) save(); }}>
          <div className="op-defense-fields"><label className="op-label" htmlFor={`${id}-receiver`}>¿Quién detuvo o atendió la petición?<textarea id={`${id}-receiver`} className="op-input" rows={2} value={explanation} onChange={e => { setExplanation(e.target.value); setSavedMessage(''); }} required /></label><label className="op-label" htmlFor={`${id}-order`}>¿Por qué importa este orden?<textarea id={`${id}-order`} className="op-input" rows={2} value={order} onChange={e => { setOrder(e.target.value); setSavedMessage(''); }} required /></label><label className="op-label" htmlFor={`${id}-impact`}>¿Qué consecuencia tiene?<textarea id={`${id}-impact`} className="op-input" rows={2} value={impact} onChange={e => { setImpact(e.target.value); setSavedMessage(''); }} placeholder="Desacoplamiento, extensibilidad, rendimiento o trazabilidad." required /></label></div>
          <div className="op-actions"><button type="submit" className="op-button op-button-primary" disabled={!complete || (!!submission && !dirty)}>{submission ? 'Actualizar solución' : 'Guardar solución'}</button><span className="op-small">{!complete ? 'Completen las tres respuestas.' : submission && !dirty ? 'Explicación pendiente de revisión docente.' : 'La explicación será evaluada por el docente.'}</span></div><p className="op-save-status" role="status">{savedMessage}</p>
        </form></details>}
      </div>
    </div>
    <footer className="op-footer"><span role="status">{stored ? 'Avance guardado en este navegador' : 'Guardado local no disponible; conserva esta pestaña abierta'}</span><div className="op-actions"><button className="op-button op-button-quiet" onClick={() => onNavigate('code')}>Código Vivo</button><button className="op-button op-button-quiet" onClick={() => onNavigate('quiz')}>Autoevaluación</button>{index < 2 && <button className="op-button" onClick={onNext}>Siguiente misión<ArrowRight size={15} aria-hidden="true" /></button>}</div></footer>
  </>;
}

export function OperationGame({ onStepChange, onNavigate, onExplore }: { onStepChange: (step: SimulationStep | null) => void; onNavigate: (tab: ActiveTab) => void; onExplore: () => void }) {
  const [round, setRound] = useActivityState('active-round', 0, (v): v is number => Number.isInteger(v) && Number(v) >= 0 && Number(v) < 3);
  const [team, setTeam, teamStored] = useActivityState('team', '', isString);
  const [editingTeam, setEditingTeam] = useState(!team);
  const [draft, setDraft] = useState(team);
  const teamId = useId();
  const selectRound = (index: number) => { setRound(index); onStepChange(null); };
  return <div className="operation-game">
    <header className="op-header"><h2>Operación: Cadena Rota</h2><div className="op-header-meta">{editingTeam ? <form className="op-team-entry" onSubmit={e => { e.preventDefault(); if (draft.trim()) { setTeam(draft.trim()); setEditingTeam(false); } }}><label className="sr-only" htmlFor={teamId}>Nombre del equipo</label><input id={teamId} className="op-input" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Nombre del equipo" required maxLength={60} /><button className="op-button" type="submit">Listo</button></form> : <button className="op-team-tag" onClick={() => setEditingTeam(true)} aria-label={`Editar nombre del equipo ${team}`}>{team}<Pencil size={13} aria-hidden="true" /></button>}<span className="op-small">Misión {round + 1}/3</span></div></header>
    <nav className="op-rounds" aria-label="Misiones del desafío">{rounds.map((mission, i) => <button key={mission.title} className="op-round-button" aria-current={round === i ? 'step' : undefined} aria-controls={`operation-round-${i}`} onClick={() => selectRound(i)}><span className="op-round-number">{i + 1}</span><span className="op-round-full">{mission.short}</span><span className="op-round-mobile">Misión {i + 1}</span></button>)}</nav>
    {!teamStored && <p className="op-small" role="status">El nombre del equipo solo se conservará mientras esta pestaña esté abierta.</p>}
    {rounds.map((mission, i) => <div key={mission.title} id={`operation-round-${i}`} hidden={round !== i}><MissionRound index={i} visible={round === i} onStepChange={onStepChange} onNavigate={onNavigate} onNext={() => selectRound(Math.min(i + 1, 2))} /></div>)}
    <button className="op-button op-button-quiet op-explore-link" onClick={onExplore}>Exploración libre<ArrowRight size={15} aria-hidden="true" /></button>
  </div>;
}
