import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile, rename, realpath, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { evaluateRepair } from '../src/shared/activityRules.mjs';
import { clientAddress, createRateLimiter, digest, equalDigest, MAX_BODY_BYTES, SECURITY_HEADERS } from './security.mjs';
import { finalStandings, reviewFields, reviewSignature, scoreTeam } from './scoring.mjs';

const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const secret = () => randomBytes(32).toString('base64url');
const hash = digest;
const filters = ['ERP', 'Autorización', 'Autenticación', 'Auditoría'];
const policies = ['Registrar y derivar a revisión', 'Rechazar explícitamente', 'Escalar a una autoridad externa'];
const text = (v, max = 4000) => typeof v === 'string' && v.length <= max;
const handlerFields = ['id', 'name', 'role', 'description', 'actionSummary', 'canHandleConditionText', 'avatarIcon'];
const handlersValid = v => Array.isArray(v) && v.length > 0 && v.length <= 30 && new Set(v.map(h => h?.id)).size === v.length && v.every(h => h && handlerFields.every(f => text(h[f], 1000)) && ['lte','gte','eq'].includes(h.operator) && Number.isFinite(h.threshold) && typeof h.stopOnHandle === 'boolean');
const chainValid = v => Array.isArray(v) && v.length === 4 && new Set(v).size === 4 && v.every(f => filters.includes(f));

async function body(req) {
  if (!req.headers['content-type']?.startsWith('application/json')) fail(415, 'Se requiere JSON.');
  if(Number(req.headers['content-length'])>MAX_BODY_BYTES) fail(413,'El trabajo excede el tamaño permitido.');
  let size = 0; const chunks = [];
  for await (const chunk of req) { size += chunk.length; if (size > MAX_BODY_BYTES) fail(413, 'El trabajo excede el tamaño permitido.'); chunks.push(chunk); }
  try { const value = JSON.parse(Buffer.concat(chunks).toString()); if (!value || typeof value !== 'object' || Array.isArray(value)) fail(400, 'JSON inválido.'); return value; }
  catch { fail(400, 'JSON inválido.'); }
}
function cleanWork(index, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail(400, 'Trabajo inválido.');
  const prefix = `round-${index}:`; const state = {};
  for (const [key, value] of Object.entries(input)) {
    if (!key.startsWith(prefix)) fail(400, 'Solo puedes modificar la misión abierta.');
    const field = key.slice(prefix.length);
    if (field === 'handlers') { if (!handlersValid(value)) fail(400, 'Manejadores inválidos.'); state[key] = value.map(h => Object.fromEntries([...handlerFields,'operator','threshold','stopOnHandle',...(text(h.unit,20)?['unit']:[])].map(f => [f,h[f]]))); }
    else if (field === 'http') { if (!chainValid(value)) fail(400, 'Filtros inválidos.'); state[key] = value; }
    else if (field === 'policy') { if (value !== '' && !policies.includes(value)) fail(400, 'Política inválida.'); state[key] = value; }
    else if (['explanation','order','impact'].includes(field)) { if (!text(value)) fail(400, 'Respuesta demasiado larga.'); state[key] = value; }
    else if (field === 'submission') { if (value !== null && (!value || !['explanation','order','impact'].every(f => text(value[f]) && value[f].trim()))) fail(400, 'Completa las tres explicaciones.'); state[key] = value === null ? null : Object.fromEntries(['explanation','order','impact'].map(f => [f,value[f]])); }
    else if (field === 'criteria' || field === 'evidence') { /* Derived exclusively on the server. */ }
    else fail(400, 'Campo desconocido.');
  }
  const evaluated = evaluateRepair(index, {handlers:state[prefix+'handlers'],chain:state[prefix+'http'],policy:state[prefix+'policy']});
  const validated = Array.isArray(input[prefix+'criteria']) && input[prefix+'criteria'].length > 0;
  state[prefix+'criteria'] = validated ? evaluated.criteria : [];
  state[prefix+'evidence'] = validated ? evaluated.evidence : [];
  if (state[prefix+'submission'] && (!validated || !evaluated.criteria.every(c => c.passed))) fail(422, 'Primero valida una reparación correcta.');
  return state;
}

export async function createRoomServer({ dataDir = process.env.ROOM_DATA_DIR || './.room-data', staticDir = './dist', allowedOrigin = process.env.ROOM_ALLOWED_ORIGIN, creationKey = process.env.ROOM_CREATION_KEY, creationKeyFile = process.env.ROOM_CREATION_KEY_FILE, production = process.env.NODE_ENV === 'production', trustProxy = process.env.ROOM_TRUST_PROXY === '1', rateLimits, maxDataBytes = 16*1024*1024, maxPendingWrites = 32 } = {}) {
  if(!creationKey && creationKeyFile) creationKey=(await readFile(creationKeyFile,'utf8')).trim();
  if(creationKey && !/^[A-Za-z0-9_-]{32,128}$/.test(creationKey)) throw new Error('ROOM_CREATION_KEY debe contener entre 32 y 128 caracteres seguros.');
  if(production && !creationKey) throw new Error('Producción requiere ROOM_CREATION_KEY o ROOM_CREATION_KEY_FILE para proteger la creación de salas.');
  if(production && (!allowedOrigin || new URL(allowedOrigin).protocol!=='https:')) throw new Error('Producción requiere ROOM_ALLOWED_ORIGIN con HTTPS.');
  const creationHash=creationKey?hash(creationKey):null;
  await mkdir(dataDir, { recursive: true, mode: 0o700 });
  const database = resolve(dataDir, 'rooms.json');
  let rooms = {};
  try { if((await stat(database)).size>maxDataBytes)throw new Error('El archivo de salas supera el límite configurado. Respalda y archiva salas antes de continuar.'); rooms = JSON.parse(await readFile(database, 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  // Serialize mutations and persist before acknowledging. Roll back on disk failure.
  let queue = Promise.resolve(); let pendingWrites=0;
  const mutate = task => {
    if(pendingWrites>=maxPendingWrites)fail(503,'Servidor ocupado. Vuelve a intentarlo.');
    pendingWrites++;
    const pending = queue.then(async () => { const before = structuredClone(rooms); try { const result = task(); const serialized=JSON.stringify(rooms); if(Buffer.byteLength(serialized)>maxDataBytes)fail(507,'Se alcanzó el límite de almacenamiento de salas.'); await writeFile(database+'.tmp', serialized, {mode:0o600}); await rename(database+'.tmp', database); return result; } catch(e) { rooms = before; throw e; } finally { pendingWrites--; } });
    queue = pending.catch(() => {}); return pending;
  };
  const publicRoom = room => ({id:room.id,title:room.title,round:room.round,open:room.open,version:room.version,completedAt:room.completedAt ?? null,results:room.results ?? null});
  const teamView = (room, team) => ({room:publicRoom(room),team:{id:team.id,name:team.name,revision:team.revision,state:team.state,score:scoreTeam(team)}});
  const rateLimit=createRateLimiter(rateLimits);
  const server = createServer(async (req, res) => {
    const send = (status, data) => { res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...SECURITY_HEADERS,...(status===429?{'Retry-After':'60'}:{})}); res.end(JSON.stringify(data)); };
    try {
      const url = new URL(req.url, 'http://localhost'); const address=clientAddress(req,trustProxy); rateLimit('api',address); const parts = url.pathname.split('/').filter(Boolean);
      if (url.pathname.startsWith('/api/')) {
        const origin = req.headers.origin;
        const expected = allowedOrigin || `http://${req.headers.host}`;
        if (origin && (allowedOrigin ? origin !== allowedOrigin : origin !== expected && origin !== `https://${req.headers.host}`)) fail(403, 'Origen no autorizado.');
        if (url.pathname === '/api/health' && req.method === 'GET') return send(200,{ok:true,roomCreationProtected:!!creationHash});
        if(req.headers['sec-fetch-site']==='cross-site' && !['GET','HEAD'].includes(req.method))fail(403,'Petición entre sitios no autorizada.');
        if (parts[1] !== 'rooms') fail(404,'Ruta desconocida.');
        if (parts.length === 2 && req.method === 'POST') {
          rateLimit('create',address);
          const supplied=req.headers['x-room-creation-key'];
          if(creationHash && (typeof supplied!=='string' || supplied.length>128 || !equalDigest(hash(supplied),creationHash)))fail(401,'Se requiere la clave docente para crear salas.');
          const input = await body(req);
          if (!text(input.title,80) || !input.title.trim()) fail(400,'Escribe un nombre para la sala.');
          const token = secret(); const id = randomBytes(6).toString('hex');
          const result = await mutate(() => { if (Object.keys(rooms).length >= 500) fail(503,'Se alcanzó la capacidad de salas del servidor.'); const room = {id,title:input.title.trim(),teacherHash:hash(token),round:null,open:false,version:0,teams:{},completedAt:null,results:null,createdAt:Date.now()}; rooms[id]=room; return publicRoom(room); });
          return send(201,{room:result,token});
        }
        if(!/^[a-f0-9]{12}$/.test(parts[2]||''))fail(404,'La sala no existe. Revisa el enlace.');
        if(parts.length>4)fail(404,'Ruta desconocida.');
        await queue;
        let room = rooms[parts[2]]; if (!room) fail(404,'La sala no existe. Revisa el enlace.');
        if (parts.length === 3 && req.method === 'GET') return send(200,{room:publicRoom(room)});
        if (parts[3] === 'join' && req.method === 'POST') {
          rateLimit('join',address); rateLimit('join',room.id); const input = await body(req); if (!text(input.name,60) || !input.name.trim()) fail(400,'Escribe un nombre de equipo.');
          const token = secret(); const id = randomBytes(8).toString('hex');
          const result = await mutate(() => { room=rooms[parts[2]]; if(room.completedAt) fail(423,'La actividad ya terminó. Consulta el resultado final.'); if(Object.keys(room.teams).length >= 100) fail(409,'La sala está completa.'); if(Object.values(room.teams).some(t=>t.name.toLocaleLowerCase()===input.name.trim().toLocaleLowerCase())) fail(409,'Ese nombre ya está en uso. Elige otro o vuelve al navegador donde entraste.'); const team={id,name:input.name.trim(),tokenHash:hash(token),state:{},revision:0,updatedAt:Date.now()}; room.teams[id]=team; return teamView(room,team); });
          return send(201,{...result,token});
        }
        const token = req.headers.authorization?.replace(/^Bearer /,'');
        const credential=typeof token==='string' && /^[A-Za-z0-9_-]{43}$/.test(token)?hash(token):null;
        const teacher = equalDigest(credential,room.teacherHash);
        const team = Object.values(room.teams).find(t=>equalDigest(credential,t.tokenHash));
        if (!teacher && !team) fail(401,'El enlace o la clave no son válidos.');
        rateLimit(['GET','HEAD'].includes(req.method)?'read':'write',credential);
        if (parts[3] === 'control') {
          if(!teacher) fail(403,'Solo el docente puede controlar la sala.');
          if(req.method === 'GET') return send(200,{room:publicRoom(room),teams:Object.values(room.teams).map(({tokenHash,...t})=>({...t,score:scoreTeam(t)}))});
          if(req.method === 'PATCH') {
            const input=await body(req); if(![0,1,2].includes(input.round) || typeof input.open !== 'boolean' || !Number.isInteger(input.version)) fail(400,'Control inválido.');
            const result=await mutate(()=> { room=rooms[parts[2]]; if(room.completedAt) fail(423,'La actividad terminó; crea una nueva sala para jugar otra vez.'); if(input.version!==room.version) fail(409,'La sala cambió. Actualiza el control e inténtalo de nuevo.'); room.round=input.round;room.open=input.open;room.version++; return publicRoom(room); });return send(200,{room:result});
          }
        }
        if(parts[3]==='review' && req.method==='POST') {
          if(!teacher) fail(403,'Solo el docente puede asignar puntos.');
          const input=await body(req);
          if(![0,1,2].includes(input.round) || !input.scores || !reviewFields.every(field=>Number.isInteger(input.scores[field]) && input.scores[field]>=0 && input.scores[field]<=5)) fail(400,'Cada criterio debe recibir un entero entre 0 y 5.');
          const result=await mutate(()=>{
            room=rooms[parts[2]];
            if(room.completedAt) fail(423,'La puntuación final está cerrada.');
            const target=/^[a-f0-9]{16}$/.test(input.teamId||'')?room.teams[input.teamId]:null; if(!target) fail(404,'Equipo desconocido.');
            if(target.revision!==input.teamRevision) fail(409,'La entrega cambió. Revisa la versión actual antes de calificar.');
            if(!target.state[`round-${input.round}:submission`] || !scoreTeam(target).rounds[input.round].completed) fail(422,'El equipo debe entregar una reparación validada antes de recibir puntos de explicación.');
            target.reviews ??= {};
            target.reviews[input.round]={scores:Object.fromEntries(reviewFields.map(field=>[field,input.scores[field]])),signature:reviewSignature(target.state,input.round),reviewedAt:Date.now()};
            room.version++;
            return {room:publicRoom(room),team:{id:target.id,score:scoreTeam(target)}};
          }); return send(200,result);
        }
        if(parts[3]==='finish' && req.method==='POST') {
          if(!teacher) fail(403,'Solo el docente puede finalizar la actividad.');
          const input=await body(req);
          if(input.confirm!==true || !Number.isInteger(input.version)) fail(400,'Confirma el cierre de la actividad.');
          const result=await mutate(()=>{
            room=rooms[parts[2]];
            if(room.completedAt) return publicRoom(room);
            if(input.version!==room.version) fail(409,'La sala cambió. Revisa el resumen y confirma de nuevo.');
            room.completedAt=Date.now();room.open=false;room.version++;
            room.results=finalStandings(room,room.completedAt);
            return publicRoom(room);
          }); return send(200,{room:result});
        }
        if(parts[3]==='work') {
          if(!team) fail(403,'Se requiere una clave de equipo.');
          if(req.method==='GET') return send(200,teamView(room,team));
          if(req.method==='PUT') {
            const input=await body(req);
            const result=await mutate(()=> { room=rooms[parts[2]]; const current=room.teams[team.id]; if(room.completedAt) fail(423,'La actividad terminó. Los cambios pendientes no cuentan en el resultado final.'); if(!room.open || room.round!==input.round) fail(423,'La misión se cerró o cambió. Tu borrador permanece en este navegador.'); if(input.revision!==current.revision) fail(409,'El equipo tiene cambios de otra pestaña. Recarga antes de continuar.'); const state=cleanWork(room.round,input.state); const before=reviewSignature(current.state,room.round); current.state={...current.state,...state}; if(before!==reviewSignature(current.state,room.round) && current.reviews) delete current.reviews[room.round]; current.revision++;current.updatedAt=Date.now();return teamView(room,current); }); return send(200,result);
          }
        }
        fail(404,'Ruta desconocida.');
      }
      if(!['GET','HEAD'].includes(req.method)) fail(405,'Método no permitido.');
      const root=await realpath(staticDir); let decoded;try{decoded=decodeURIComponent(url.pathname);}catch{fail(400,'Ruta inválida.');}
      if(decoded.includes('\0') || decoded.split('/').some(part=>part.startsWith('.')))fail(403,'Ruta no permitida.');
      const path=resolve(root,'.'+decoded);
      if(path!==root && !path.startsWith(root+sep)) fail(403,'Ruta no permitida.');
      const file=url.pathname==='/' ? resolve(root,'index.html') : path;
      let contents;try{const actual=await realpath(file);if(actual!==root && !actual.startsWith(root+sep))fail(403,'Ruta no permitida.');const size=(await stat(actual)).size;if(size>8*1024*1024)fail(413,'Archivo demasiado grande.');contents=req.method==='HEAD'?null:await readFile(actual);}catch(e){if(e.status)throw e;fail(404,'Archivo no encontrado.');}
      const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json'};
      res.writeHead(200,{'Content-Type':mime[extname(file)] || 'application/octet-stream','Cache-Control':extname(file)==='.html'?'no-store':'public, max-age=3600',...SECURITY_HEADERS});res.end(req.method==='HEAD'?undefined:contents);
    }catch(e){send(e.status || 500,{error:e.status?e.message:'No se pudo guardar en el servidor. Inténtalo de nuevo.'});}
  });
  server.requestTimeout=15000;server.headersTimeout=10000;server.keepAliveTimeout=5000;server.maxRequestsPerSocket=100;server.maxConnections=256;
  return server;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server=await createRoomServer(); const port=Number(process.env.PORT || 3001);
  server.listen(port,process.env.HOST || '0.0.0.0',()=>console.log(`Salas disponibles en http://localhost:${port}`));
}
