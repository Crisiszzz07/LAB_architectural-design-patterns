export interface RoundScore { automatic:number; explanation:number; total:number; completed:boolean; reviewed:boolean; pendingReview:boolean }
export interface TeamScore { rounds:RoundScore[]; automatic:number; explanation:number; total:number; completed:number; pendingReviews:number }
export interface Review { scores:{receiver:number;order:number;impact:number}; signature:string; reviewedAt:number }
export interface Standing extends TeamScore { id:string; name:string; rank:number }
export interface FinalResults { completedAt:number; maximum:number; standings:Standing[]; winners:string[] }
export interface RoomInfo { id: string; title: string; round: number | null; open: boolean; version: number; completedAt:number|null; results:FinalResults|null }
export interface TeamInfo { id: string; name: string; revision: number; state: Record<string, unknown>; updatedAt?: number; score?:TeamScore; reviews?:Record<number,Review> }
export interface TeamResponse { room: RoomInfo; team: TeamInfo; token?: string }
export class RoomError extends Error { constructor(public status: number, message: string) { super(message); } }
export async function roomApi<T>(path: string, token?: string, method = 'GET', data?: unknown, extraHeaders?: Record<string,string>): Promise<T> {
  const response = await fetch(`/api/rooms${path}`, { method, headers: { ...extraHeaders, ...(token ? {Authorization:`Bearer ${token}`} : {}), ...(data ? {'Content-Type':'application/json'} : {}) }, ...(data ? {body:JSON.stringify(data)} : {}), signal:AbortSignal.timeout(8000) });
  let result; try { result = await response.json(); } catch { throw new RoomError(response.status, 'El servidor de salas no está disponible.'); }
  if (!response.ok) throw new RoomError(response.status, result.error || 'No se pudo completar la operación.');
  return result;
}
export const roomLink = (id: string, token?: string) => `${window.location.origin}${window.location.pathname}#sala/${id}${token ? `/docente/${token}` : ''}`;
export function localRead<T>(key: string): T | null { try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; } }
export function localWrite(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } }

export async function creationProtection(): Promise<boolean> { const response=await fetch('/api/health',{signal:AbortSignal.timeout(5000)}); if(!response.ok)throw new Error('No se pudo comprobar el servidor de salas.'); const data=await response.json(); return data.roomCreationProtected===true; }
