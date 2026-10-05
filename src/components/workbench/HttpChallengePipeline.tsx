import { useEffect, useState, useId } from 'react';
import { ArrowDown, ArrowUp, ChevronRight, Pause, Play, ShieldCheck, KeyRound, ScrollText, Building2 } from 'lucide-react';
import { Filter, httpRequests, runHttp } from './operationRules';

export function HttpChallengePipeline({ chain, onChange, visible }: { chain: Filter[]; onChange: (chain: Filter[]) => void; visible: boolean }) {
  const [requestIndex, setRequestIndex] = useState(0);
  const [run, setRun] = useState<ReturnType<typeof runHttp> | null>(null);
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const requestId = useId();
  useEffect(() => { if (!visible) setPlaying(false); }, [visible]);
  useEffect(() => {
    if (!playing || !run) return;
    if (step >= run.trace.length - 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setStep(s => s + 1), 850);
    return () => window.clearTimeout(timer);
  }, [playing, run, step]);
  const clear = () => { setRun(null); setStep(-1); setPlaying(false); };
  const execute = () => { setRun(runHttp(chain, httpRequests[requestIndex])); setStep(0); setPlaying(true); };
  const finished = !!run && step === run.trace.length - 1;
  return <section className="op-workspace" aria-label="Pipeline HTTP de la misión">
    <div className="op-section-head"><div><h3>Cadena de seguridad</h3><p>Dominio de la misión · POST /erp/compras</p></div><code>Token + rol admin</code></div>
    <div className="op-dispatch"><label className="op-label" htmlFor={requestId}>Solicitud de prueba<select id={requestId} className="op-input" value={requestIndex} disabled={playing} onChange={e => { clear(); setRequestIndex(Number(e.target.value)); }}>{httpRequests.map((req, i) => <option key={req.title} value={i}>{req.title} · esperado {req.expected}</option>)}</select></label><button className="op-button" disabled={playing} onClick={execute}><Play size={16} aria-hidden="true" />Simular petición</button></div>
    <div className="op-chain-origin"><span>Cliente HTTP</span><code>Token {httpRequests[requestIndex].token ? 'válido' : 'inválido'} · rol {httpRequests[requestIndex].role}</code></div>
    <ol className="op-chain">{chain.map((filter, i) => {
      const visited = !!run && run.trace.slice(0, step + 1).includes(filter);
      const active = !!run && (run.trace[step] === filter || (filter === 'Auditoría' && finished && run.audited));
      const terminal = visited && run?.handler === filter;
      const state = active && filter === 'Auditoría' && finished ? 'Resultado auditado' : terminal ? `${run?.status === 200 ? 'Acceso al ERP' : 'Petición rechazada'} · ${run?.status}` : active ? 'Evaluando / delegando' : visited ? 'Delegó al sucesor' : 'En espera';
      return <li key={filter} className={`op-node ${terminal ? run?.safe && run.status === 200 ? 'op-node-handled' : 'op-node-rejected' : active ? 'op-node-evaluating' : ''}`}><span className="op-node-number">{i + 1}{filter === 'Auditoría' ? <ScrollText size={18} aria-hidden="true" /> : filter === 'Autenticación' ? <KeyRound size={18} aria-hidden="true" /> : filter === 'Autorización' ? <ShieldCheck size={18} aria-hidden="true" /> : <Building2 size={18} aria-hidden="true" />}</span><div className="op-node-body"><strong>{filter}</strong><div className="op-node-meta"><span>{filter === 'Auditoría' ? 'Envuelve al sucesor y registra su respuesta' : filter === 'Autenticación' ? 'Verifica el token' : filter === 'Autorización' ? 'Verifica el rol admin' : 'Procesa la compra'}</span><span className="op-node-state">{state}</span></div></div><div className="op-node-actions">{[-1, 1].map(delta => <button key={delta} className="op-icon-button" aria-label={`Mover ${filter} ${delta < 0 ? 'antes' : 'después'}`} disabled={playing || i + delta < 0 || i + delta >= chain.length} onClick={() => { const next = [...chain]; [next[i], next[i + delta]] = [next[i + delta], next[i]]; clear(); onChange(next); }}>{delta < 0 ? <ArrowUp size={16} aria-hidden="true" /> : <ArrowDown size={16} aria-hidden="true" />}</button>)}</div></li>;
    })}</ol>
    <div className="op-trace" aria-live="polite"><div className="op-section-head"><h4>Traza de ejecución</h4><div className="op-actions"><span className="op-small">{run ? `${step + 1}/${run.trace.length}` : 'Sin ejecutar'}</span><button className="op-icon-button" aria-label={playing ? 'Pausar ejecución' : 'Continuar ejecución'} disabled={!run || finished} onClick={() => setPlaying(!playing)}>{playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}</button><button className="op-icon-button" aria-label="Siguiente paso" disabled={!run || playing || finished} onClick={() => setStep(s => s + 1)}><ChevronRight size={16} aria-hidden="true" /></button></div></div>
      <p className="op-route">Recorrido: {run ? run.trace.slice(0, step + 1).filter(event => chain.includes(event as Filter)).join(' → ') : 'Sin simular'}</p>
      <p className="op-context">{!run ? 'Simula una petición para observar dónde continúa o se detiene.' : !finished ? `Evaluando: ${run.trace[step]}.` : `La petición terminó en ${run.handler} con HTTP ${run.status}. ${!run.safe ? 'El ERP procesó sin verificar los permisos. ' : ''}${run.audited ? 'Auditoría registró la respuesta al regresar la llamada.' : 'Auditoría no llegó a ejecutarse.'}`}</p>
    </div>
  </section>;
}
