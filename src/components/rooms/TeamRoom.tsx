import { useCallback, useEffect, useRef, useState } from 'react';
import { RoomResults } from './RoomResults';
import { OperationGame } from '../workbench/OperationGame';
import { ActivityRoomContext } from './ActivityRoomContext';
import { localRead, localWrite, roomApi, RoomError, TeamResponse } from './roomApi';
import { ActiveTab } from '../layout/Navbar';
import { SimulationStep } from '../../types';

export type GameNavigation = {onStepChange:(step:SimulationStep|null)=>void;onNavigate:(tab:ActiveTab)=>void;onExplore:()=>void};
interface Draft { revision:number; state:Record<string,unknown>; dirty:number[] }
export function TeamRoom({session,token,...navigation}: GameNavigation & {session:TeamResponse;token:string}) {
  const namespace=`cor-room:${session.room.id}:${session.team.id}`;
  const cached=useRef(localRead<Draft>(namespace+':outbox'));
  const validCache=!!cached.current && Number.isInteger(cached.current.revision) && cached.current.state && typeof cached.current.state==='object' && !Array.isArray(cached.current.state) && Array.isArray(cached.current.dirty) && cached.current.dirty.every(v=>[0,1,2].includes(v));
  const usable=validCache && cached.current!.revision===session.team.revision;
  const staleDraft=validCache && !usable && cached.current!.dirty.length>0;
  const initial=useRef<Record<string,unknown>>({...session.team.state,...((usable||staleDraft)?cached.current!.state:{}),team:session.team.name});
  const snapshot=useRef(initial.current);
  const dirty=useRef(new Set<number>((usable||staleDraft)?cached.current!.dirty:[]));
  const revision=useRef(session.team.revision);
  const roomRef=useRef(session.room);
  const [room,setRoom]=useState(session.room);
  const [score,setScore]=useState(session.team.score);
  const [status,setStatus]=useState(staleDraft?'El servidor tiene otra versión. Descarga tu borrador antes de recuperar esa versión.':dirty.current.size?'Cambios pendientes de sincronizar':'Sincronizado');
  const [conflict,setConflict]=useState(!!staleDraft);
  const [draftStored,setDraftStored]=useState(true);
  const blocked=useRef(!!staleDraft);
  const busy=useRef(false);
  const sequence=useRef(0);
  const alive=useRef(true);
  const storeDraft=useCallback(()=>setDraftStored(localWrite(namespace+':outbox',{revision:revision.current,state:snapshot.current,dirty:[...dirty.current]})),[namespace]);
  const updateRoom=useCallback((next:TeamResponse['room'])=>{if(next.version>=roomRef.current.version){roomRef.current=next;setRoom(next);}},[]);
  const onChange=useCallback((key:string,value:unknown)=>{
    const match=/^round-([012]):/.exec(key); if(!match)return;
    if(JSON.stringify(snapshot.current[key])===JSON.stringify(value))return;
    snapshot.current={...snapshot.current,[key]:value};
    if(Number(match[1])!==roomRef.current.round || !roomRef.current.open)return;
    dirty.current.add(Number(match[1]));sequence.current++;storeDraft();
    if(!blocked.current)setStatus('Guardando…');
  },[storeDraft]);
  useEffect(()=>{
    alive.current=true;
    let timeout:ReturnType<typeof setTimeout>;
    const tick=async()=>{
      if(busy.current || !alive.current)return;
      busy.current=true;
      try {
        const current=roomRef.current;
        if(!blocked.current && !current.completedAt && current.open && current.round!==null && dirty.current.has(current.round)){
          const prefix=`round-${current.round}:`;const state=Object.fromEntries(Object.entries(snapshot.current).filter(([key])=>key.startsWith(prefix)));
          const sentSequence=sequence.current;
          const response=await roomApi<TeamResponse>(`/${current.id}/work`,token,'PUT',{revision:revision.current,round:current.round,state});
          if(!alive.current)return;
          revision.current=response.team.revision;updateRoom(response.room);setScore(response.team.score);
          if(sentSequence===sequence.current)dirty.current.delete(current.round);
          storeDraft();setStatus(dirty.current.size?'Borrador pendiente; se enviará al abrir su misión':'Sincronizado');
        }else{
          const response=await roomApi<TeamResponse>(`/${current.id}/work`,token);
          if(!alive.current)return;
          updateRoom(response.room);setScore(response.team.score);
          if(response.room.completedAt){setStatus(dirty.current.size?'Actividad finalizada. El borrador pendiente no cuenta en el resultado.':'Actividad finalizada');}
          else if(response.team.revision!==revision.current){blocked.current=true;setConflict(true);setStatus('Hay cambios de otra pestaña. Descarga tu borrador y recarga.');}
          else if(!blocked.current)setStatus(dirty.current.size?'Borrador pendiente; se enviará al abrir su misión':'Sincronizado');
        }
      }catch(error){
        if(!alive.current)return;
        if(error instanceof RoomError && error.status===409){blocked.current=true;setConflict(true);setStatus(error.message);}
        else if(error instanceof RoomError && error.status===423){setStatus(error.message);try{const response=await roomApi<TeamResponse>(`/${roomRef.current.id}/work`,token);updateRoom(response.room);}catch{/* Retry on the next tick. */}}
        else if(error instanceof RoomError && [400,401,403,422].includes(error.status)){blocked.current=true;setConflict(true);setStatus(error.message);}
        else setStatus('Sin conexión. Los cambios permanecen en este navegador.');
      }finally{busy.current=false;if(alive.current)timeout=setTimeout(tick,1000);}
    };
    void tick();
    const warn=(event:BeforeUnloadEvent)=>{if(dirty.current.size&&!roomRef.current.completedAt){event.preventDefault();event.returnValue='';}};
    window.addEventListener('beforeunload',warn);
    return()=>{alive.current=false;clearTimeout(timeout);window.removeEventListener('beforeunload',warn);};
  },[token,storeDraft,updateRoom]);
  const download=()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(snapshot.current,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='borrador-cadena-rota.json';a.click();URL.revokeObjectURL(url);};
  const recover=()=>{dirty.current.clear();try{for(const key of Object.keys(localStorage))if(key.startsWith(namespace+':'))localStorage.removeItem(key);}catch{/* Server state remains recoverable. */}window.location.reload();};
  return <section className="room-session" aria-label="Sala del equipo">
    <div className="room-session-bar"><div><strong>{room.title}</strong><p>{room.completedAt?'Actividad finalizada':room.round===null?'Esperando la primera misión':`Misión ${room.round+1} · ${room.open?'Abierta':'Cerrada por el docente'}`}</p></div><div className="room-own-score"><strong>{score?.total??0}/75 puntos</strong><span role="status">{status}</span></div></div>
    {!draftStored && <p className="room-feedback" role="status">Guardado local no disponible. Mantén esta pestaña abierta hasta que los cambios estén sincronizados.</p>}
    {conflict && <div className="room-feedback"><button className="op-button" onClick={download}>Descargar borrador</button><button className="op-button" onClick={recover}>Recuperar versión del servidor</button></div>}
    {room.results ? <><RoomResults results={room.results} teamId={session.team.id}/>{dirty.current.size>0&&<button className="op-button" onClick={download}>Descargar borrador pendiente</button>}</> : room.round===null ? <p className="room-waiting">Equipo {session.team.name}, ya están dentro. El tablero aparecerá cuando el docente abra una misión.</p> : <ActivityRoomContext.Provider value={{room,team:session.team.name,namespace,initial:initial.current,onChange,status}}><OperationGame {...navigation}/></ActivityRoomContext.Provider>}
  </section>;
}
