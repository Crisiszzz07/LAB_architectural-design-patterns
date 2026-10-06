import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, symlink, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createRoomServer } from './rooms.mjs';

async function fixture(options={}) {
  const directory=await mkdtemp(join(tmpdir(),'cor-security-'));const dataDir=join(directory,'data');const staticDir=join(directory,'dist');await mkdir(staticDir);await writeFile(join(staticDir,'index.html'),'<html><body>Laboratorio</body></html>');
  let server;
  try{server=await createRoomServer({dataDir,staticDir,...options});server.listen(0,'127.0.0.1');await once(server,'listening');}catch(e){await rm(directory,{recursive:true,force:true});throw e;}
  const base=`http://127.0.0.1:${server.address().port}`;
  const request=async(path,{method='GET',token,headers={},body}={})=>{
    const response=await fetch(base+path,{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body?{'Content-Type':'application/json'}:{}),...headers},...(body?{body:JSON.stringify(body)}:{})});
    const result=await response.text();return {status:response.status,headers:response.headers,text:result,data:response.headers.get('content-type')?.includes('application/json')?JSON.parse(result):null};
  };
  return {request,directory,dataDir,staticDir,close:async()=>{await new Promise(resolve=>server.close(resolve));await rm(directory,{recursive:true,force:true});}};
}

test('Producción exige una clave de creación y un origen HTTPS configurado',async()=>{
  await assert.rejects(fixture({production:true,creationKey:undefined,creationKeyFile:undefined}),/Producción requiere ROOM_CREATION_KEY/);
  await assert.rejects(fixture({production:true,creationKey:'a'.repeat(43)}),/ROOM_ALLOWED_ORIGIN/);
  const app=await fixture({production:true,creationKey:'a'.repeat(43),allowedOrigin:'https://lab.example'});
  try{
    assert.equal((await app.request('/api/health')).data.roomCreationProtected,true);
    assert.equal((await app.request('/api/rooms',{method:'POST',body:{title:'No autorizada'}})).status,401);
    assert.equal((await app.request('/api/rooms',{method:'POST',headers:{'X-Room-Creation-Key':'wrong'},body:{title:'No autorizada'}})).status,401);
    const created=await app.request('/api/rooms',{method:'POST',headers:{'X-Room-Creation-Key':'a'.repeat(43)},body:{title:'Clase'}});assert.equal(created.status,201);
    const joined=await app.request(`/api/rooms/${created.data.room.id}/join`,{method:'POST',body:{name:'Equipo sin cuenta'}});assert.equal(joined.status,201);
    const disk=await readFile(join(app.dataDir,'rooms.json'),'utf8');assert.equal(disk.includes('a'.repeat(43)),false);assert.equal(disk.includes(created.data.token),false);assert.equal(disk.includes(joined.data.token),false);
  }finally{await app.close();}
});

test('CSP, anti-framing, traversal y enlaces simbólicos no permiten acceder a archivos privados',async()=>{
  const app=await fixture();
  try {
    const page=await app.request('/');assert.equal(page.status,200);assert.match(page.headers.get('content-security-policy'),/script-src 'self'/);assert.match(page.headers.get('content-security-policy'),/frame-ancestors 'none'/);assert.equal(page.headers.get('x-frame-options'),'DENY');assert.equal(page.headers.get('referrer-policy'),'no-referrer');assert.equal(page.headers.get('x-content-type-options'),'nosniff');
    const secret=join(app.directory,'secret.txt');await writeFile(secret,'PRIVATE_SENTINEL');await symlink(secret,join(app.staticDir,'leak.txt'));
    for(const path of['/leak.txt','/%2e%2e%2fsecret.txt','/.env','/.git/config','/src/shared/activityRules.mjs','/%00']){const response=await app.request(path);assert.ok([400,403,404].includes(response.status),path);assert.equal(response.text.includes('PRIVATE_SENTINEL'),false);}
    assert.equal((await app.request('/api/rooms/__proto__')).status,404);assert.equal((await app.request('/api/rooms/constructor')).status,404);
    assert.equal((await app.request('/api/rooms',{method:'POST',body:{title:'x'.repeat(128001)}})).status,413);
  }finally{await app.close();}
});

test('El origen configurado no se puede sustituir mediante Host y se rechazan escrituras cross-site',async()=>{
  const app=await fixture({allowedOrigin:'https://lab.example'});
  try{
    assert.equal((await app.request('/api/rooms',{method:'POST',headers:{Origin:'https://evil.example',Host:'evil.example'},body:{title:'Ataque'}})).status,403);
    assert.equal((await app.request('/api/rooms',{method:'POST',headers:{Origin:'https://lab.example','Sec-Fetch-Site':'cross-site'},body:{title:'Ataque'}})).status,403);
    assert.equal((await app.request('/api/rooms',{method:'POST',headers:{Origin:'https://lab.example'},body:{title:'Legítima'}})).status,201);
  }finally{await app.close();}
});

test('Las escrituras autenticadas y los intentos de crear salas tienen límites de frecuencia',async()=>{
  const app=await fixture({rateLimits:{write:2,create:2}});
  try{
    const created=(await app.request('/api/rooms',{method:'POST',body:{title:'Clase'}})).data;
    for(let i=0;i<2;i++){const result=await app.request(`/api/rooms/${created.room.id}/control`,{method:'PATCH',token:created.token,body:{round:0,open:true,version:i}});assert.equal(result.status,200);}
    const limited=await app.request(`/api/rooms/${created.room.id}/control`,{method:'PATCH',token:created.token,body:{round:0,open:true,version:2}});assert.equal(limited.status,429);assert.equal(limited.headers.get('retry-after'),'60');
    assert.equal((await app.request('/api/rooms',{method:'POST',body:{title:'Otra'}})).status,201);assert.equal((await app.request('/api/rooms',{method:'POST',body:{title:'Otra más'}})).status,429);
  }finally{await app.close();}
});

test('El límite de disco revierte la escritura y conserva la sala previa',async()=>{
  const app=await fixture({maxDataBytes:800});
  try {
    const first=await app.request('/api/rooms',{method:'POST',body:{title:'Primera'}});assert.equal(first.status,201);
    let rejected=false;for(let i=0;i<5;i++){const result=await app.request('/api/rooms',{method:'POST',body:{title:'Sala '+i}});if(result.status===507){rejected=true;break;}}
    assert.equal(rejected,true);assert.equal((await app.request(`/api/rooms/${first.data.room.id}`)).status,200);assert.ok(Buffer.byteLength(await readFile(join(app.dataDir,'rooms.json'),'utf8'))<=800);
  }finally{await app.close();}
});
