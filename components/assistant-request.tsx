'use client';
import {useState} from 'react';
import {commercialEmail,type Flow,type Language} from '../lib/assistant-knowledge';
import {extractDetails,fieldError,requestFields,requestSummary,requestTitle} from '../lib/assistant-request';
export default function AssistantRequest({flow,lang,initial,onClose}:{flow:Flow;lang:Language;initial:string;onClose:()=>void}){
 const en=lang==='en',fields=requestFields[flow];
 const [data,setData]=useState<Record<string,string>>(()=>extractDetails(initial));
 const [done,setDone]=useState<string[]>(()=>Object.keys(extractDetails(initial)));
 const [active,setActive]=useState<string[]>(()=>fields.filter(f=>!extractDetails(initial)[f.key]).slice(0,2).map(f=>f.key));
 const [error,setError]=useState(''),[consent,setConsent]=useState(false),[reference]=useState(()=>`TE-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().slice(0,8).toUpperCase()}`);
 const summary=requestSummary(flow,data,reference,lang);
 function next(e:React.FormEvent){e.preventDefault();for(const key of active){const f=fields.find(f=>f.key===key)!;const issue=fieldError(f,data[key]??'',lang);if(issue){setError(issue);return;}}const updated=[...done,...active];setDone(updated);setActive(fields.filter(f=>!updated.includes(f.key)).slice(0,2).map(f=>f.key));setError('');setConsent(false);}
 return <section className="assistant-request" aria-label={requestTitle(flow,lang)}>
  <h3>{requestTitle(flow,lang)}</h3>
  <p className="fine">{en?'We will prepare your request step by step. Optional details can be left blank. Do not enter bank details, passwords or sensitive documents.':'Préparons votre demande étape par étape. Les détails facultatifs peuvent rester vides. Ne saisissez ni données bancaires, ni mots de passe, ni documents sensibles.'}</p>
  {active.length>0?<form onSubmit={next}>
   <p className="fine">{Math.min(done.length,fields.length)} / {fields.length} {en?'details reviewed':'informations traitées'}</p>
   {active.map(key=>{const f=fields.find(f=>f.key===key)!;return <label key={key} htmlFor={'request-'+key}>{f[lang]} {!f.required&&<small>({en?'optional':'facultatif'})</small>}{f.choices?<select id={'request-'+key} required={f.required} value={data[key]??''} onChange={e=>setData({...data,[key]:e.target.value})}><option value="">{en?'Choose':'Choisir'}</option>{f.choices[lang].map(x=><option key={x}>{x}</option>)}</select>:<input id={'request-'+key} type={f.type==='number'?'text':f.type??'text'} inputMode={f.type==='number'?'decimal':undefined} required={f.required} maxLength={600} value={data[key]??''} onChange={e=>setData({...data,[key]:e.target.value})}/>}</label>})}
   {error&&<p role="alert">{error}</p>}<button className="button red">{en?'Continue':'Continuer'}</button>
  </form>:<>
   <h4>{en?'Review your request':'Vérifiez votre demande'}</h4>
   <p className="fine">{en?'This is a draft request, not a confirmed quote or delivery. Nothing has been sent yet.':'Il s’agit d’une demande préparée, pas d’un devis ou d’une livraison confirmés. Rien n’a encore été envoyé.'}</p>
   <dl className="request-summary">{fields.map(f=><div key={f.key}><dt>{f[lang]}</dt><dd>{data[f.key]|| (f.key==='distance'?(en?'To be calculated':'À calculer'):'—')} <button type="button" className="text-button" aria-label={(en?'Edit ':'Modifier ')+f[lang]} onClick={()=>{setActive([f.key]);setConsent(false);}}>{en?'Edit':'Modifier'}</button></dd></div>)}</dl>
   <p className="fine">{en?'Reference':'Référence'} : {reference}</p>
   <label className="consent"><input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/><span>{en?'I confirm these details and agree to share them with TADJI ÉNERGIE for this request.':'Je confirme ces informations et accepte de les communiquer à TADJI ÉNERGIE pour traiter cette demande.'}</span></label>
   {consent&&<div className="request-send"><a className="button red" target="_blank" rel="noreferrer" href={`https://wa.me/${data.destinationCountry==='Mali'?'22377006666':'221774909898'}?text=${encodeURIComponent(summary)}`}>WhatsApp ↗</a><a className="text-link" href={`mailto:${commercialEmail}?subject=${encodeURIComponent(requestTitle(flow,lang)+' '+reference)}&body=${encodeURIComponent(summary)}`}>{en?'Prepare email':'Préparer l’email'} ↗</a></div>}
   <p className="fine">{en?'The selected app opens with your summary. You send it there; this site cannot confirm receipt. Supporting documents should be shared through a channel agreed with our team.':'L’application choisie s’ouvre avec votre récapitulatif. Vous y effectuez l’envoi ; le site ne peut pas confirmer sa réception. Les justificatifs sont à partager par un canal convenu avec notre équipe.'}</p>
  </>}
  <button className="text-button" type="button" onClick={onClose}>{en?'Back to assistant':'Retour à l’assistant'}</button>
 </section>;
}
