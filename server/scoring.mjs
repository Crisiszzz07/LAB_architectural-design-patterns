import { createHash } from 'node:crypto';
import { evaluateRepair } from '../src/shared/activityRules.mjs';

export const reviewFields = ['receiver', 'order', 'impact'];
export function reviewSignature(state, round) {
  const prefix = `round-${round}:`;
  return createHash('sha256').update(JSON.stringify(['handlers','http','policy','submission'].map(field => state[prefix+field] ?? null))).digest('hex');
}
export function scoreTeam(team) {
  const rounds = [0,1,2].map(round => {
    const prefix = `round-${round}:`;
    const validated = Array.isArray(team.state[prefix+'criteria']) && team.state[prefix+'criteria'].length === 3;
    const repair = evaluateRepair(round, {handlers:team.state[prefix+'handlers'],chain:team.state[prefix+'http'],policy:team.state[prefix+'policy']});
    const completed = validated && repair.criteria.every(criterion => criterion.passed);
    const submitted = completed && !!team.state[prefix+'submission'];
    const review = team.reviews?.[round];
    const reviewed = submitted && review?.signature === reviewSignature(team.state,round);
    const automatic = completed ? 10 : 0;
    const explanation = reviewed ? reviewFields.reduce((total,field) => total+review.scores[field],0) : 0;
    return {automatic,explanation,total:automatic+explanation,completed,reviewed:!!reviewed,pendingReview:submitted&&!reviewed};
  });
  return {rounds,automatic:rounds.reduce((n,r)=>n+r.automatic,0),explanation:rounds.reduce((n,r)=>n+r.explanation,0),total:rounds.reduce((n,r)=>n+r.total,0),completed:rounds.filter(r=>r.completed).length,pendingReviews:rounds.filter(r=>r.pendingReview).length};
}
export function finalStandings(room, completedAt) {
  const sorted = Object.values(room.teams).map(team=>({id:team.id,name:team.name,...scoreTeam(team)})).sort((a,b)=>b.total-a.total || a.name.localeCompare(b.name,'es') || a.id.localeCompare(b.id));
  let rank=0;
  const standings=sorted.map((team,index)=>{if(index===0 || team.total!==sorted[index-1].total)rank=index+1;return {...team,rank};});
  return {completedAt,maximum:75,standings,winners:standings.filter(team=>team.rank===1).map(team=>team.id)};
}
