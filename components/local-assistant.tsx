'use client';
import {useEffect,useRef,useState} from 'react';
import type {WebWorkerMLCEngine} from '@mlc-ai/web-llm';
type Message={role:'user'|'assistant';content:string};
export default function LocalAssistant({lang}:{lang:'fr'|'en'}){
 const en=lang==='en';
 const [state,setState]=useState<'idle'|'loading'|'ready'|'error'>('idle');
 const [progress,setProgress]=useState(0),[busy,setBusy]=useState(false),[input,setInput]=useState(''),[messages,setMessages]=useState<Message[]>([]);
 const worker=useRef<Worker|null>(null),engine=useRef<WebWorkerMLCEngine|null>(null),generation=useRef(0);
 const stop=()=>{generation.current++;worker.current?.terminate();worker.current=null;engine.current=null;};
 useEffect(()=>()=>{generation.current++;worker.current?.terminate();},[]);
 async function start(){
  stop(); const id=generation.current;setState('loading');setProgress(0);
  try{
   const gpu=(navigator as Navigator & {gpu?:{requestAdapter:()=>Promise<unknown>}}).gpu;
   if(!gpu||!await gpu.requestAdapter())throw Error('unsupported');
   const {CreateWebWorkerMLCEngine}=await import('@mlc-ai/web-llm');
   if(id!==generation.current)return;
   worker.current=new Worker(new URL('./ai.worker.ts',import.meta.url),{type:'module'});
   const loaded=await CreateWebWorkerMLCEngine(worker.current,'Qwen2.5-0.5B-Instruct-q4f32_1-MLC',{initProgressCallback:p=>{if(id===generation.current)setProgress(Math.round(p.progress*100));}},{context_window_size:4096});
   if(id!==generation.current)return;
   engine.current=loaded;setState('ready');
  }catch{if(id===generation.current){stop();setState('error');}}
 }
 async function send(e:React.FormEvent){
  e.preventDefault();if(!engine.current||busy||!input.trim())return;
  const id=generation.current;
  const next:Message[]=[...messages,{role:'user',content:input.trim()}];setMessages(next);setInput('');setBusy(true);
  try{
   const response=await engine.current.chat.completions.create({messages:[{role:'system',content:en?"You are TADJI ÉNERGIE's helpful commercial assistant. Answer in English in 3 short sentences using these company facts. Services: international petroleum sourcing, maritime logistics, port operations, road transport and distribution. Markets: Senegal, Mali, Ivory Coast. To request a quote, ask for product, quantity, destination and deadline. Contact: info@tadji.energy or WhatsApp +221774909898 (Senegal), +22377006666 (Mali). Prices and availability must be confirmed by our team. Stay on these business topics.":"Tu es l’assistant commercial de TADJI ÉNERGIE. Réponds en français en 3 phrases courtes à partir de cette fiche officielle. Nos services : approvisionnement international en produits pétroliers, logistique maritime, opérations portuaires, transport routier et distribution. Marchés : Sénégal, Mali, Côte d’Ivoire. Pour un devis, demander le produit, la quantité, la destination et le délai. Contact : info@tadji.energy ou WhatsApp +221774909898 au Sénégal, +22377006666 au Mali. Les prix et disponibilités doivent être confirmés par notre équipe. Reste sur ces sujets commerciaux."},...next.slice(-6)],stream:true,max_tokens:160,temperature:0.2});
   let text='';
   for await(const chunk of response){if(id!==generation.current)break;text+=chunk.choices[0]?.delta.content??'';setMessages([...next,{role:'assistant',content:text}]);}
   if(id===generation.current&&!text.trim())throw Error('empty');
  }catch{if(id===generation.current){stop();setState('error');}}
  finally{if(id===generation.current||!engine.current)setBusy(false);}
 }
 return <div className="local-ai">
  <p className="fine">{en?'Welcome to TADJI ÉNERGIE. Our AI assistant helps you explore our services and prepare your quote request.':'Bienvenue chez TADJI ÉNERGIE. Notre assistant IA vous accompagne pour découvrir nos services et préparer votre demande de devis.'}</p>
  {state!=='ready'&&<p className="fine">{en?'Starting for the first time requires a download. A Wi-Fi connection is recommended.':'Le premier démarrage nécessite un téléchargement. Une connexion Wi-Fi est recommandée.'}</p>}
  {state==='error'&&<p role="alert">{en?'AI could not run on this device or network. Use the Guide tab or contact us on WhatsApp.':'L’IA n’a pas pu démarrer sur cet appareil ou ce réseau. Utilisez l’onglet Guide ou contactez-nous sur WhatsApp.'}</p>}
  {(state==='idle'||state==='error')&&<button className="button red" onClick={start}>{en?'Start the conversation':'Démarrer la conversation'}</button>}
  {state==='loading'&&<div role="status"><p>{en?'Preparing your assistant':'Préparation de votre assistant'} : {progress}%</p><progress value={progress} max={100}/><button className="text-button" onClick={()=>{stop();setState('idle');}}>{en?'Cancel':'Annuler'}</button></div>}
  {state==='ready'&&<>
   <div role="log" aria-live="polite">{messages.map((m,i)=><p className="chat-answer" key={i}><strong>{m.role==='user'?(en?'You':'Vous'):'TADJI IA'} : </strong>{m.content}</p>)}</div>
   <form onSubmit={send}><label className="fine" htmlFor="local-question">{en?'Your question — do not share sensitive information.':'Votre question — ne partagez aucune information sensible.'}</label><textarea id="local-question" maxLength={600} required value={input} onChange={e=>setInput(e.target.value)} disabled={busy}/><button className="button red" disabled={busy}>{busy?(en?'Thinking…':'Réflexion…'):(en?'Send':'Envoyer')}</button></form>
   {busy&&<button className="text-button" onClick={()=>{stop();setBusy(false);setState('idle');}}>{en?'Stop AI':'Arrêter l’IA'}</button>}
   <button className="text-button" disabled={busy} onClick={()=>setMessages([])}>{en?'Clear conversation':'Effacer la conversation'}</button>
  </>}
 </div>;
}
