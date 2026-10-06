import { useEffect, useId, useRef } from 'react';
export function FinishDialog({open,busy,teams,incomplete,pendingReviews,error,onCancel,onConfirm}:{open:boolean;busy:boolean;teams:number;incomplete:number;pendingReviews:number;error:string;onCancel:()=>void;onConfirm:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);const cancel=useRef<HTMLButtonElement>(null);const id=useId();
  useEffect(()=>{const node=dialog.current;if(!node)return;if(open&&!node.open){node.showModal();cancel.current?.focus();}else if(!open&&node.open)node.close();},[open]);
  return <dialog ref={dialog} className="room-finish-dialog" aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={e=>{if(busy)e.preventDefault();else onCancel();}} onClose={onCancel}>
    <h2 id={`${id}-title`}>¿Finalizar la actividad?</h2><p id={`${id}-description`}>Se cerrarán todas las misiones y se publicará el resultado definitivo. Esta sala no podrá reabrirse.</p>
    <ul><li>{teams} equipos participantes.</li><li>{incomplete} equipos con misiones pendientes.</li><li>{pendingReviews} explicaciones sin calificar; aportarán 0 puntos.</li></ul><p>No se esperará a equipos en progreso o sin empezar. Solo cuentan los cambios que el servidor haya recibido al confirmar.</p>
    {error&&<p className="room-feedback" role="alert">{error}</p>}
    <div className="op-actions"><button ref={cancel} className="op-button" disabled={busy} onClick={onCancel}>Seguir con la actividad</button><button className="op-button op-button-primary" disabled={busy} onClick={onConfirm}>{busy?'Finalizando…':'Confirmar finalización'}</button></div>
  </dialog>;
}
