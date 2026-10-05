import { HandlerNode } from '../../types';

export function receiver(handlers: HandlerNode[], value: number) {
  return handlers.find(h => h.operator === 'lte' ? value <= h.threshold : h.operator === 'gte' ? value >= h.threshold : h.operator === 'eq' && value === h.threshold);
}

export type Filter = 'Auditoría' | 'Autenticación' | 'Autorización' | 'ERP';
export const httpRequests = [
  { title: 'Token inválido', token: false, role: 'admin', expected: 401 },
  { title: 'Rol insuficiente', token: true, role: 'lector', expected: 403 },
  { title: 'Petición válida', token: true, role: 'admin', expected: 200 },
];
export function runHttp(chain: Filter[], request: typeof httpRequests[number]) {
  const trace: string[] = [];
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
