import {createHmac,createHash,timingSafeEqual} from 'node:crypto';
export const COOKIE='tadji_admin';
export function equalSecret(a:string,b:string){return timingSafeEqual(createHash('sha256').update(a).digest(),createHash('sha256').update(b).digest())}
export function createSession(secret:string,now=Date.now()){const expires=String(now+8*60*60*1000);return expires+'.'+createHmac('sha256',secret).update(expires).digest('hex')}
export function validSession(token:string|undefined,secret:string|undefined,now=Date.now()){if(!token||!secret||secret.length<32)return false;const parts=token.split('.');if(parts.length!==2||!/^\d+$/.test(parts[0])||Number(parts[0])<=now||Number(parts[0])>now+8*60*60*1000)return false;return equalSecret(parts[1],createHmac('sha256',secret).update(parts[0]).digest('hex'))}
export function sameOrigin(request:Request){return request.headers.get('origin')===new URL(request.url).origin}
