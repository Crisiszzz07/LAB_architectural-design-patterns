import { createHash, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';

export const MAX_BODY_BYTES = 128000;
export const SECURITY_HEADERS = {
  'Referrer-Policy':'no-referrer',
  'X-Content-Type-Options':'nosniff',
  'X-Frame-Options':'DENY',
  'Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
};
export const digest = value => createHash('sha256').update(value).digest('hex');
export const equalDigest = (a,b) => typeof a==='string' && typeof b==='string' && /^[a-f0-9]{64}$/.test(a) && /^[a-f0-9]{64}$/.test(b) && timingSafeEqual(Buffer.from(a),Buffer.from(b));
export function clientAddress(req,trustProxy) {
  const forwarded=req.headers['x-real-ip'];
  return trustProxy && typeof forwarded==='string' && isIP(forwarded) ? forwarded : req.socket.remoteAddress || 'unknown';
}
export function createRateLimiter({api=12000,write=120,read=180,join=120,create=10,maxKeys=10000}={}) {
  const limits={api,write,read,join,create};
  const buckets=new Map();let lastPrune=0;
  return (type,key)=>{
    const now=Date.now();
    if(now-lastPrune>1000){for(const [id,entry] of buckets)if(entry.until<=now)buckets.delete(id);lastPrune=now;}
    const id=type+':'+key;let entry=buckets.get(id);
    if(!entry || entry.until<=now){if(buckets.size>=maxKeys&&!buckets.has(id))throw Object.assign(new Error('Servidor ocupado. Inténtalo en un minuto.'),{status:503});entry={count:0,until:now+60000};buckets.set(id,entry);}
    entry.count++;
    if(entry.count>limits[type])throw Object.assign(new Error('Demasiadas peticiones. Espera un minuto.'),{status:429});
  };
}
