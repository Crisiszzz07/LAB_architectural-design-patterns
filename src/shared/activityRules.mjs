
export function receiver(handlers, value) {
  return handlers.find(h => h.operator === 'lte' ? value <= h.threshold : h.operator === 'gte' ? value >= h.threshold : h.operator === 'eq' && value === h.threshold);
}

export const httpRequests = [
  { title: 'Token inválido', token: false, role: 'admin', expected: 401 },
  { title: 'Rol insuficiente', token: true, role: 'lector', expected: 403 },
  { title: 'Petición válida', token: true, role: 'admin', expected: 200 },
];
export function runHttp(chain, request) {
  const trace = [];
  let audited = false;
  let authenticated = false;
  let authorized = false;
  let status = 0;
  let handler = 'Fin de cadena';
  for (const filter of chain) {
    trace.push(filter);
    if (filter === 'Auditoría') { audited = true; continue; }
    if (filter === 'Autenticación') {
      if (!request.token) { status = 401; handler = filter; break; }
      authenticated = true;
    }
    if (filter === 'Autorización') {
      if (!authenticated) { status = 401; handler = filter; break; }
      if (request.role !== 'admin') { status = 403; handler = filter; break; }
      authorized = true;
    }
    if (filter === 'ERP') { status = 200; handler = filter; break; }
  }
  const safe = status !== 200 || (authenticated && authorized);
  if (audited) trace.push(`Auditoría: registra respuesta ${status || 'sin respuesta'} al regresar la llamada.`);
  return { status, handler, audited, safe, trace };
}

const base = { handlers: [{id:'h-lead',threshold:500,operator:'lte'},{id:'h-manager',threshold:2500,operator:'lte'},{id:'h-cfo',threshold:10000,operator:'lte'},{id:'h-board',threshold:50000,operator:'lte'}] };
export function evaluateRepair(index, {handlers = [], chain = [], policy = ''}) {
    let findings;
    let checks;
    if (index === 0) {
      const values = [350, 2200, 8500, 32000];
      findings = values.map((value, i) => { const h = receiver(handlers, value); return { request: `$${value.toLocaleString('es-CO')}`, handler: h?.name ?? 'Sin receptor', result: h ? 'Atendida' : 'Sin respuesta', valid: h?.id === base.handlers[i].id }; });
      const original = handlers.length === 4 && handlers.every(h => h.stopOnHandle) && base.handlers.every(h => handlers.some(next => next.id === h.id && next.threshold === h.threshold && next.operator === h.operator));
      const ascending = handlers.length === 4 && handlers.every(h => h.stopOnHandle) && base.handlers.every((h, i) => handlers[i]?.id === h.id);
      const correct = findings.filter(f => f.valid).length;
      checks = [{ passed: original, detail: original ? 'Los cuatro responsables mantienen sus límites.' : 'Se modificó o eliminó un responsable o su límite.' }, { passed: ascending, detail: ascending ? 'La autoridad aumenta al avanzar por los sucesores.' : 'El orden todavía permite acaparamiento o saltos de autoridad.' }, { passed: correct === 4, detail: `${correct} de 4 montos llegaron al responsable esperado.` }];
    } else if (index === 1) {
      const last = handlers[handlers.length - 1]; const target = receiver(handlers, 95000);
      const original = handlers.length === 5 && handlers.every(h => h.stopOnHandle) && base.handlers.every((h, i) => handlers[i]?.id === h.id && handlers[i]?.threshold === h.threshold && handlers[i]?.operator === h.operator);
      const covered = handlers.length > 4 && target?.id === last?.id && last?.operator === 'gte' && last.threshold <= 0 && last.stopOnHandle;
      checks = [{ passed: original, detail: original ? 'La cadena original precede al manejador terminal.' : 'Falta conservar los cuatro responsables antes del fallback.' }, { passed: covered, detail: covered ? '$95.000 tiene un receptor terminal; se cubren los montos positivos.' : '$95.000 no tiene un fallback final que cubra el rango completo.' }, { passed: !!policy, detail: policy ? `${policy}. La coherencia con su acción se revisa en la defensa.` : 'El equipo aún no eligió qué responder fuera de rango.' }];
      findings = [{ request: '$95.000', handler: target?.name ?? 'Sin receptor', result: target?.actionSummary ?? 'Recepción no garantizada', valid: checks.every(c => c.passed) }];
    } else {
      const runs = httpRequests.map(req => runHttp(chain, req));
      findings = runs.map((run, i) => ({ request: httpRequests[i].title, handler: run.handler, result: `HTTP ${run.status || 'sin respuesta'} · ${run.audited ? 'Auditada' : 'Sin auditoría'}${run.safe ? '' : ' · Acceso sin verificar'}`, valid: run.status === httpRequests[i].expected && run.safe }));
      const ordered = chain.indexOf('Autenticación') < chain.indexOf('Autorización') && chain.indexOf('Autorización') < chain.indexOf('ERP');
      const audits = runs.filter(run => run.audited).length; const correct = findings.filter(f => f.valid).length;
      checks = [{ passed: ordered, detail: ordered ? 'Token y rol se verifican antes de llegar al ERP.' : 'El ERP o la autorización aparecen antes de los controles necesarios.' }, { passed: audits === 3, detail: `Auditoría: ${audits} de 3 peticiones registradas.` }, { passed: correct === 3, detail: `${correct} de 3 respuestas coinciden con 401, 403 y 200 sin accesos inseguros.` }];
    }
return { criteria: checks, evidence: findings };
}
