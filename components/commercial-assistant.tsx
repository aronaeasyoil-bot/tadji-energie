'use client';
import {useState} from 'react';
import {faq,faqAnswer,intent,visitorLanguage,commercialEmail,type Flow,type Language} from '../lib/assistant-knowledge';
import AssistantRequest from './assistant-request';
export default function CommercialAssistant({lang,faqQuestions,faqAnswers}:{lang:Language;faqQuestions?:string[];faqAnswers?:string[]}){
 const [language,setLanguage]=useState(lang),[input,setInput]=useState('');
 const [messages,setMessages]=useState<{question:string;answer:string}[]>([]);
 const [flow,setFlow]=useState<Flow|null>(null),[initial,setInitial]=useState('');
 const en=language==='en';
 function reply(question:string,faqIndex?:number){
  const nextLang=faqIndex===undefined?visitorLanguage(question,language):language;
  const overrides=nextLang===lang?faqAnswers:undefined;
  const answer=faqIndex===undefined?faqAnswer(question,nextLang,overrides):(overrides?.[faqIndex]||faq[faqIndex][nextLang][1]);
  setLanguage(nextLang);setMessages(m=>[...m.slice(-7),{question,answer}]);setInput('');
  const action=faqIndex===undefined?intent(question):undefined;
  if(action){setInitial([...messages.map(m=>m.question),question].join('\n'));setFlow(action);}
 }
 const suggestions=en?['Request a fuel quote','Request a delivery','Discuss a supply contract','Become a partner','Make a complaint','Contact sales']:['Obtenir un devis de carburant','Demander une livraison','Étudier un contrat d’approvisionnement','Devenir partenaire','Déposer une réclamation','Contacter le service commercial'];
 return <div>
  <p>{en?'Welcome to TADJI ÉNERGIE, your fuel supply and distribution partner in West Africa. How can we help you today?':'Bienvenue chez TADJI ÉNERGIE, votre partenaire pour l’approvisionnement et la distribution de carburants en Afrique de l’Ouest. Comment puis-je vous aider aujourd’hui ?'}</p>
  <div role="log" aria-live="polite">{messages.slice(-3).map((m,i)=><div key={i}><p><strong>{en?'You':'Vous'} :</strong> {m.question}</p><p className="chat-answer">{m.answer}</p></div>)}</div>
  {flow?<AssistantRequest key={flow+initial} flow={flow} lang={language} initial={initial} onClose={()=>setFlow(null)}/>:<>
   <div className="questions">{suggestions.map(q=><button key={q} onClick={()=>reply(q)}>{q} →</button>)}</div>
   <form onSubmit={e=>{e.preventDefault();if(input.trim())reply(input.trim());}}>
    <label htmlFor="commercial-question">{en?'Your question':'Votre question'}</label>
    <textarea id="commercial-question" value={input} onChange={e=>setInput(e.target.value)} maxLength={1200} required placeholder={en?'Example: I want 50,000 litres of diesel in Bamako':'Exemple : je souhaite 50 000 litres de gasoil à Bamako'}/>
    <button className="button red" type="submit">{en?'Send':'Envoyer'}</button>
   </form>
   <details><summary>{en?'Frequently asked questions':'Questions fréquentes'}</summary><div className="questions">{faq.map((f,i)=><button key={f.id} onClick={()=>reply(language===lang?(faqQuestions?.[i]||f[language][0]):f[language][0],i)}>{language===lang?(faqQuestions?.[i]||f[language][0]):f[language][0]}</button>)}</div></details>
  </>}
  <a className="text-link" href="https://wa.me/221774909898" target="_blank" rel="noreferrer">{en?'Talk to our team on WhatsApp':'Échanger avec notre équipe sur WhatsApp'} ↗</a>
  <p><a href={`mailto:${commercialEmail}`}>{commercialEmail}</a></p>
  <p className="fine">{en?'Automatic guidance. Only our team can confirm prices, stock, contracts and delivery commitments.':'Réponses automatiques. Seule notre équipe peut confirmer les prix, stocks, contrats et engagements de livraison.'}</p>
 </div>;
}
