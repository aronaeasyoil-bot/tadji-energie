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
   const response=await engine.current.chat.completions.create({messages:[{role:'system',content:`You are TADJI ÉNERGIE's commercial assistant. Reply briefly in ${en?'English':'French'}. Only use these facts: services are international petroleum sourcing, maritime logistics, port operations, road tanker coordination and business distribution. Markets: Senegal, Mali, Ivory Coast. Contact info@tadji.energy, Senegal +221774909898, Mali +22377006666. For a quote ask product, quantity, destination and deadline. Never invent prices, availability, certifications, assets or guarantees. Unknown information must be confirmed by the team. Do not give dangerous fuel handling instructions. Stay on company topics.`},...next.slice(-6)],max_tokens:220,temperature:0.2});
   if(id===generation.current){const text=response.choices[0]?.message.content?.trim();if(!text)throw Error('empty');setMessages([...next,{role:'assistant',content:text}]);}
  }catch{if(id===generation.current){stop();setState('error');}}
  finally{if(id===generation.current||!engine.current)setBusy(false);}
 }
 return <div className="local-ai">
  <p className="fine">{en?'Free local AI · No account or card. Replies are generated on your device and may contain errors. Confirm commercial details with our team.':'IA locale gratuite · Sans compte ni carte. Les réponses sont générées sur votre appareil et peuvent contenir des erreurs. Faites confirmer les détails commerciaux par notre équipe.'}</p>
  {state!=='ready'&&<p className="fine">{en?'First use downloads several hundred MB from Hugging Face and GitHub. Requires WebGPU and about 1 GB of graphics memory. Wi-Fi recommended.':'La première utilisation télécharge plusieurs centaines de Mo depuis Hugging Face et GitHub. WebGPU et environ 1 Go de mémoire graphique sont nécessaires. Wi-Fi conseillé.'}</p>}
  {state==='error'&&<p role="alert">{en?'AI could not run on this device or network. Use the Guide tab or contact us on WhatsApp.':'L’IA n’a pas pu démarrer sur cet appareil ou ce réseau. Utilisez l’onglet Guide ou contactez-nous sur WhatsApp.'}</p>}
  {(state==='idle'||state==='error')&&<button className="button red" onClick={start}>{en?'Download and start AI':'Télécharger et démarrer l’IA'}</button>}
  {state==='loading'&&<div role="status"><p>{en?'Loading model':'Chargement du modèle'} : {progress}%</p><progress value={progress} max={100}/><button className="text-button" onClick={()=>{stop();setState('idle');}}>{en?'Cancel':'Annuler'}</button></div>}
  {state==='ready'&&<>
   <div role="log" aria-live="polite">{messages.map((m,i)=><p className="chat-answer" key={i}><strong>{m.role==='user'?(en?'You':'Vous'):'TADJI IA'} : </strong>{m.content}</p>)}</div>
   <form onSubmit={send}><label className="fine" htmlFor="local-question">{en?'Your question — do not share sensitive information.':'Votre question — ne partagez aucune information sensible.'}</label><textarea id="local-question" maxLength={600} required value={input} onChange={e=>setInput(e.target.value)} disabled={busy}/><button className="button red" disabled={busy}>{busy?(en?'Thinking…':'Réflexion…'):(en?'Send':'Envoyer')}</button></form>
   <button className="text-button" disabled={busy} onClick={()=>setMessages([])}>{en?'Clear conversation':'Effacer la conversation'}</button>
  </>}
 </div>;
}
