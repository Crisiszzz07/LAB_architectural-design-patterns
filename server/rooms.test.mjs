import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { createRoomServer } from './rooms.mjs';
import { reviewSignature, scoreTeam } from './scoring.mjs';
const handlers=[['h-lead',500],['h-manager',2500],['h-cfo',10000],['h-board',50000]].map(([id,threshold])=>({id,threshold,operator:'lte',stopOnHandle:true,name:id,role:'Responsable',description:'Aprueba',actionSummary:'Atendida',canHandleConditionText:'monto',avatarIcon:'User'}));

test('Salas: permisos, aislamiento, evaluación, cierre, concurrencia y recuperación en disco',async()=>{
  const dataDir=await mkdtemp(join(tmpdir(),'cor-rooms-test-'));
  let server=await createRoomServer({dataDir});
  const listen=async()=>{server.listen(0,'127.0.0.1');await once(server,'listening');return `http://127.0.0.1:${server.address().port}`;};
  let base=await listen();
  const request=async(path,token,method='GET',body)=>{const response=await fetch(base+'/api/rooms'+path,{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};};
  try{
    const created=await request('',null,'POST',{title:'Arquitectura'});assert.equal(created.status,201);const {room,token:teacher}=created.data;
    const a=(await request(`/${room.id}/join`,null,'POST',{name:'Delta'})).data;
    const b=(await request(`/${room.id}/join`,null,'POST',{name:'Omega'})).data;
    assert.equal((await request(`/${room.id}/join`,null,'POST',{name:'delta'})).status,409);
    assert.equal((await request(`/${room.id}/control`,a.token)).status,403);
    assert.equal((await request(`/${room.id}/work`,'bad-token')).status,401);
    const publicRoom=await request(`/${room.id}`);assert.equal(publicRoom.data.teams,undefined);assert.equal(JSON.stringify(publicRoom.data).includes(teacher),false);
    let control=(await request(`/${room.id}/control`,teacher)).data;
    await request(`/${room.id}/control`,teacher,'PATCH',{round:0,open:true,version:control.room.version});
    const prefix='round-0:';
    const forged={ [prefix+'handlers']:[handlers[3],...handlers.slice(0,3)],[prefix+'criteria']:[{passed:true},{passed:true},{passed:true}],[prefix+'evidence']:[{valid:true}] };
    let result=await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:0,state:forged});assert.equal(result.status,200);assert.equal(result.data.team.state[prefix+'criteria'].filter(c=>c.passed).length,1);
    assert.deepEqual((await request(`/${room.id}/work`,b.token)).data.team.state,{});
    const work={[prefix+'handlers']:handlers,[prefix+'criteria']:[{}],[prefix+'submission']:{explanation:'Cada responsable',order:'Autoridad creciente',impact:'Desacoplamiento'}};
    result=await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:1,state:work});assert.equal(result.status,200);assert.equal(result.data.team.state[prefix+'criteria'].filter(c=>c.passed).length,3);assert.ok(result.data.team.state[prefix+'submission']);
    assert.equal((await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:1,state:work})).status,409);
    assert.equal((await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:2,state:{'round-1:policy':'Rechazar explícitamente'}})).status,400);
    const malicious=structuredClone(work);malicious[prefix+'handlers'][0].threshold=NaN;assert.equal((await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:2,state:malicious})).status,400);
    const unsafe={...work,[prefix+'handlers']:[handlers[3],...handlers.slice(0,3)]};assert.equal((await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:2,state:unsafe})).status,422);
    control=(await request(`/${room.id}/control`,teacher)).data;
    assert.equal(control.teams.find(t=>t.name==='Delta').state[prefix+'submission'].impact,'Desacoplamiento');assert.equal(JSON.stringify(control).includes(a.token),false);
    await request(`/${room.id}/control`,teacher,'PATCH',{round:0,open:false,version:control.room.version});assert.equal((await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:2,state:work})).status,423);
    control=(await request(`/${room.id}/control`,teacher)).data;await request(`/${room.id}/control`,teacher,'PATCH',{round:2,open:true,version:control.room.version});
    const http={'round-2:http':['Auditoría','Autenticación','Autorización','ERP'],'round-2:criteria':[{}]};result=await request(`/${room.id}/work`,b.token,'PUT',{round:2,revision:0,state:http});assert.equal(result.status,200);assert.equal(result.data.team.state['round-2:criteria'].filter(c=>c.passed).length,3);
    const version=(await request(`/${room.id}/work`,a.token)).data.team.revision;
    const concurrent=await Promise.all([request(`/${room.id}/work`,a.token,'PUT',{round:2,revision:version,state:http}),request(`/${room.id}/work`,a.token,'PUT',{round:2,revision:version,state:http})]);assert.deepEqual(concurrent.map(r=>r.status).sort(),[200,409]);
    await new Promise(resolve=>server.close(resolve));server=await createRoomServer({dataDir});base=await listen();
    const recovered=await request(`/${room.id}/work`,a.token);assert.equal(recovered.status,200);assert.equal(recovered.data.team.state[prefix+'submission'].impact,'Desacoplamiento');assert.equal(recovered.data.room.round,2);
    const crossOrigin=await fetch(base+'/api/rooms',{method:'POST',headers:{Origin:'https://example.invalid','Content-Type':'application/json'},body:JSON.stringify({title:'Other'})});assert.equal(crossOrigin.status,403);
  }finally{await new Promise(resolve=>server.close(resolve));await rm(dataDir,{recursive:true,force:true});}
});

test('Puntos y cierre general: revisión docente, ganador con misiones pendientes y resultado inmutable',async()=>{
  const dataDir=await mkdtemp(join(tmpdir(),'cor-score-test-'));let server=await createRoomServer({dataDir});let base;
  const listen=async()=>{server.listen(0,'127.0.0.1');await once(server,'listening');base=`http://127.0.0.1:${server.address().port}`;};await listen();
  const request=async(path,token,method='GET',body)=>{const response=await fetch(base+'/api/rooms'+path,{method,headers:{...(token?{Authorization:`Bearer ${token}`} : {}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:response.status,data:await response.json()};};
  try {
    const {room,token:teacher}=(await request('',null,'POST',{title:'Concurso'})).data;
    const a=(await request(`/${room.id}/join`,null,'POST',{name:'Delta'})).data;
    const b=(await request(`/${room.id}/join`,null,'POST',{name:'Omega'})).data;
    const c=(await request(`/${room.id}/join`,null,'POST',{name:'Sin empezar'})).data;
    await request(`/${room.id}/control`,teacher,'PATCH',{round:0,open:true,version:0});
    const work={'round-0:handlers':handlers,'round-0:criteria':[{}],'round-0:submission':{explanation:'Responsables',order:'Autoridad',impact:'Trazabilidad'}};
    let saved=await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:0,state:work});assert.equal(saved.data.team.score.total,10);assert.equal(saved.data.team.score.pendingReviews,1);
    const grade={teamId:a.team.id,teamRevision:1,round:0,scores:{receiver:5,order:4,impact:3}};
    assert.equal((await request(`/${room.id}/review`,b.token,'POST',grade)).status,403);
    assert.equal((await request(`/${room.id}/review`,teacher,'POST',{...grade,scores:{receiver:6,order:4,impact:3}})).status,400);
    assert.equal((await request(`/${room.id}/review`,teacher,'POST',{...grade,scores:{receiver:4.5,order:4,impact:3}})).status,400);
    assert.equal((await request(`/${room.id}/review`,teacher,'POST',{...grade,teamRevision:0})).status,409);
    assert.equal((await request(`/${room.id}/review`,teacher,'POST',{...grade,teamId:c.team.id,teamRevision:0})).status,422);
    saved=await request(`/${room.id}/review`,teacher,'POST',grade);assert.equal(saved.data.team.score.total,22);assert.equal(saved.data.team.score.pendingReviews,0);
    // Changing a received explanation invalidates its old grade.
    const edited=structuredClone(work);edited['round-0:submission'].impact='Extensibilidad';
    saved=await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:1,state:edited});assert.equal(saved.data.team.score.total,10);assert.equal(saved.data.team.score.pendingReviews,1);
    saved=await request(`/${room.id}/review`,teacher,'POST',{...grade,teamRevision:2});assert.equal(saved.data.team.score.total,22);
    await request(`/${room.id}/work`,b.token,'PUT',{round:0,revision:0,state:{'round-0:handlers':handlers,'round-0:criteria':[{}]}});
    const control=(await request(`/${room.id}/control`,teacher)).data;
    assert.equal((await request(`/${room.id}/finish`,a.token,'POST',{version:control.room.version,confirm:true})).status,403);
    assert.equal((await request(`/${room.id}/finish`,teacher,'POST',{version:control.room.version,confirm:false})).status,400);
    assert.equal((await request(`/${room.id}/finish`,teacher,'POST',{version:0,confirm:true})).status,409);
    const finish=await request(`/${room.id}/finish`,teacher,'POST',{version:control.room.version,confirm:true});assert.equal(finish.status,200);assert.equal(finish.data.room.open,false);
    const results=finish.data.room.results;assert.deepEqual(results.winners,[a.team.id]);assert.deepEqual(results.standings.map(t=>t.total),[22,10,0]);assert.equal(results.standings[0].completed,1);
    assert.equal((await request(`/${room.id}/work`,a.token,'PUT',{round:0,revision:2,state:edited})).status,423);
    assert.equal((await request(`/${room.id}/review`,teacher,'POST',{...grade,teamRevision:2})).status,423);
    assert.equal((await request(`/${room.id}/control`,teacher,'PATCH',{round:1,open:true,version:finish.data.room.version})).status,423);
    assert.equal((await request(`/${room.id}/join`,null,'POST',{name:'Tardío'})).status,423);
    assert.deepEqual((await request(`/${room.id}/finish`,teacher,'POST',{version:control.room.version,confirm:true})).data.room.results,results);
    const publicResult=(await request(`/${room.id}`)).data.room.results;assert.deepEqual(publicResult,results);assert.equal(JSON.stringify(publicResult).includes('Extensibilidad'),false);
    await new Promise(resolve=>server.close(resolve));server=await createRoomServer({dataDir});await listen();assert.deepEqual((await request(`/${room.id}/work`,b.token)).data.room.results,results);
    // A zero-point tie is explicit, and an empty room has no fabricated winner.
    const tie=(await request('',null,'POST',{title:'Empate'})).data;
    const t1=(await request(`/${tie.room.id}/join`,null,'POST',{name:'Uno'})).data;const t2=(await request(`/${tie.room.id}/join`,null,'POST',{name:'Dos'})).data;
    const tied=(await request(`/${tie.room.id}/finish`,tie.token,'POST',{version:0,confirm:true})).data.room.results;
    assert.deepEqual(tied.winners.sort(),[t1.team.id,t2.team.id].sort());assert.deepEqual(tied.standings.map(t=>t.rank),[1,1]);
    const empty=(await request('',null,'POST',{title:'Vacía'})).data;
    const noTeams=(await request(`/${empty.room.id}/finish`,empty.token,'POST',{version:0,confirm:true})).data.room.results;assert.deepEqual(noTeams.winners,[]);
  }finally{await new Promise(resolve=>server.close(resolve));await rm(dataDir,{recursive:true,force:true});}
});


test('La rúbrica suma como máximo 75 puntos y conserva el desglose de las tres misiones',()=>{
  const fallback={...handlers[0],id:'terminal',operator:'gte',threshold:0};
  const submission={explanation:'Responsable correcto',order:'Sucesores en orden',impact:'Trazabilidad'};
  const state={
    'round-0:handlers':handlers,'round-0:criteria':[{}, {}, {}],'round-0:submission':submission,
    'round-1:handlers':[...handlers,fallback],'round-1:policy':'Rechazar explícitamente','round-1:criteria':[{}, {}, {}],'round-1:submission':submission,
    'round-2:http':['Auditoría','Autenticación','Autorización','ERP'],'round-2:criteria':[{}, {}, {}],'round-2:submission':submission,
  };
  const team={state,reviews:Object.fromEntries([0,1,2].map(round=>[round,{signature:reviewSignature(state,round),scores:{receiver:5,order:5,impact:5}}]))};
  const score=scoreTeam(team);
  assert.equal(score.total,75);assert.equal(score.automatic,30);assert.equal(score.explanation,45);assert.equal(score.completed,3);assert.deepEqual(score.rounds.map(r=>r.total),[25,25,25]);
});
