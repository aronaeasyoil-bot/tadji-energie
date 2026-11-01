'use client';
import {useState} from 'react';
import {answerQuestion} from '../lib/commercial-assistant';
export default function CommercialAssistant({lang,questions,answers}:{lang:'fr'|'en';questions:string[];answers:string[]}){
 const en=lang==='en';
 const [input,setInput]=useState('');
 const [messages,setMessages]=useState<{question:string;answer:string}[]>([]);
 function reply(question:string,answer?:string){setMessages(m=>[...m.slice(-5),{question,answer:answer??answerQuestion(question,lang,answers)}]);setInput('');}
 return <div>
  <p>{en?'Welcome to TADJI ÉNERGIE. Choose a topic or ask a question about our services.':'Bienvenue chez TADJI ÉNERGIE. Choisissez un sujet ou posez une question sur nos services.'}</p>
  <div className="questions">{questions.map((q,i)=><button key={q} onClick={()=>reply(q,answers[i])}>{q} →</button>)}</div>
  <div role="log" aria-live="polite">{messages.map((m,i)=><div key={i}><p><strong>{en?'You':'Vous'} :</strong> {m.question}</p><p className="chat-answer">{m.answer}</p></div>)}</div>
  <form onSubmit={e=>{e.preventDefault();if(input.trim())reply(input.trim());}}>
   <label htmlFor="commercial-question">{en?'Your question':'Votre question'}</label>
   <textarea id="commercial-question" value={input} onChange={e=>setInput(e.target.value)} maxLength={600} required placeholder={en?'Services, countries, quote…':'Services, pays, devis…'}/>
   <button className="button red" type="submit">{en?'Send':'Envoyer'}</button>
  </form>
  <a className="text-link" href="https://wa.me/221774909898" target="_blank" rel="noreferrer">{en?'Talk to our team on WhatsApp':'Échanger avec notre équipe sur WhatsApp'} ↗</a>
  <p className="fine">{en?'Automatic guidance based on our company information. Our team confirms quotes and availability.':'Réponses automatiques à partir des informations de notre entreprise. Notre équipe confirme les devis et disponibilités.'}</p>
 </div>;
}
