/* Hallmark · final score as an editorial result, no podium decoration · P5 H5 E4 S5 R5 V4 */
import { Trophy } from 'lucide-react';
import { FinalResults } from './roomApi';
export function RoomResults({results,teamId}:{results:FinalResults;teamId?:string}) {
  const winners=results.standings.filter(team=>results.winners.includes(team.id));
  const heading=winners.length===0?'Sin equipos participantes':winners.length===1?`Equipo ganador: ${winners[0].name}`:'Empate · ganadores compartidos';
  return <section className="room-results" aria-label="Resultado final"><header><Trophy size={28} aria-hidden="true"/><div><span className="op-small">Actividad finalizada</span><h2>{heading}</h2>{winners.length>1&&<p>{winners.map(team=>team.name).join(' · ')}</p>}{winners.length>0&&<strong className="room-winning-score">{winners[0].total}<span> / {results.maximum} puntos</span></strong>}</div></header>
    <p className="op-small">Resultado definitivo con los datos recibidos antes del cierre. Las misiones pendientes no impiden terminar; las explicaciones sin calificar aportan 0 puntos.</p>
    {results.standings.length>0&&<ol className="room-ranking">{results.standings.map(team=><li key={team.id} data-own={team.id===teamId||undefined}><span className="room-rank">{team.rank}</span><div><strong>{team.name}{team.id===teamId?' · Tu equipo':''}</strong><p>{team.automatic} reparación + {team.explanation} explicación · {team.completed}/3 misiones reparadas</p>{team.pendingReviews>0&&<p>{team.pendingReviews} explicación{team.pendingReviews>1?'es':''} sin calificar al cierre</p>}</div><strong>{team.total}<span> puntos</span></strong></li>)}</ol>}
  </section>;
}
