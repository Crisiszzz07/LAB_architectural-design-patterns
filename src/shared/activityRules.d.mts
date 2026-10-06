import { HandlerNode } from '../types';
export type Filter = 'Auditoría' | 'Autenticación' | 'Autorización' | 'ERP';
export interface Criterion { passed: boolean; detail: string }
export interface Evidence { request: string; handler: string; result: string; valid: boolean }
export function receiver(handlers: HandlerNode[], value: number): HandlerNode | undefined;
export const httpRequests: {title: string; token: boolean; role: string; expected: number}[];
export function runHttp(chain: Filter[], request: typeof httpRequests[number]): {status:number;handler:string;audited:boolean;safe:boolean;trace:string[]};
export function evaluateRepair(index:number, data:{handlers?:HandlerNode[];chain?:Filter[];policy?:string}): {criteria:Criterion[];evidence:Evidence[]};
