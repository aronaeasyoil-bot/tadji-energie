import {normalize,type Flow,type Language} from './assistant-knowledge.ts';
export type Field={key:string;fr:string;en:string;required?:boolean;type?:'email'|'tel'|'number';choices?:{fr:string[];en:string[]}};
const field=(key:string,fr:string,en:string,required=false,type?:Field['type']):Field=>({key,fr,en,required,type});
const company=[field('company','Nom de votre entreprise','Company name',true),field('contact','Nom et prénom du contact','Contact full name',true),field('companyCountry','Pays de votre entreprise','Company country',true),field('companyAddress','Adresse complète de l’entreprise','Full company address',true),field('phone','Téléphone / WhatsApp','Phone / WhatsApp',true,'tel'),field('email','Email professionnel','Business email',true,'email'),field('sector','Secteur d’activité','Business sector',true)];
export const requestFields:Record<Flow,Field[]>={
 quote:[field('product','Produit recherché','Required product',true),field('quantity','Quantité souhaitée en litres','Quantity in litres',true,'number'),field('destinationCountry','Pays de livraison','Delivery country',true),field('destination','Ville et adresse exacte de livraison','Delivery city and full address',true),field('date','Date de livraison souhaitée','Requested delivery date',true),...company,field('quality','Spécification / qualité recherchée, si connue','Specification / quality, if known'),{...field('frequency','Achat ponctuel ou récurrent ?','One-off or recurring supply?',true),choices:{fr:['Ponctuel','Récurrent'],en:['One-off','Recurring']}},field('monthly','Volume mensuel estimé en litres (si récurrent)','Estimated monthly litres (if recurring)',false,'number'),field('loading','Dépôt / terminal de chargement, si connu','Loading depot / terminal, if known'),field('distance','Distance en kilomètres, si connue','Distance in kilometres, if known',false,'number'),{...field('deliveryMode','Mode de livraison','Delivery arrangement',true),choices:{fr:['Livraison par TADJI ÉNERGIE','Enlèvement organisé par le client'],en:['Delivery by TADJI ÉNERGIE','Collection arranged by customer']}},field('access','Conditions d’accès au site','Site access conditions'),field('capacity','Capacité de réception et installation adaptée','Receiving capacity and suitable installation'),field('deliveries','Nombre de livraisons si fractionnement','Number of deliveries if split'),field('currency','Devise souhaitée (FCFA, USD ou autre)','Preferred currency (FCFA, USD or other)'),field('payment','Modalités de paiement envisagées, sans données bancaires','Proposed payment terms, no bank details'),field('duration','Durée du contrat envisagée','Proposed contract duration'),field('offerDeadline','Date limite pour recevoir l’offre','Deadline for receiving the offer')],
 partner:[...company,field('partnership','Type de partenariat recherché','Proposed partnership type',true),field('operations','Capacités opérationnelles / volumes envisagés','Operational capacity / proposed volumes',true),field('presentation','Présentation ou lien public de votre entreprise','Company introduction or public website')],
 complaint:[field('order','Référence de commande ou de contrat','Order or contract reference',true),field('company','Nom de votre entreprise','Company name',true),field('contact','Nom et prénom du contact','Contact full name',true),field('phone','Téléphone / WhatsApp','Phone / WhatsApp',true,'tel'),field('email','Email professionnel','Business email',true,'email'),field('date','Date de l’incident','Incident date',true),field('destination','Lieu de l’incident','Incident location',true),field('issue','Description du problème','Issue description',true),field('documents','Références utiles, sans document confidentiel','Useful references, no confidential documents')]
};
export function extractDetails(text:string):Record<string,string>{
 const q=normalize(text),data:Record<string,string>={};
 const quantity=text.match(/\b(\d[\d\s\u00a0,.]*?)\s*(?:litres?|liters?|l)\b/i);
 if(quantity){const raw=quantity[1].trim();const digits=raw.replace(/[\s\u00a0]/g,'');if(/^\d+$/.test(digits))data.quantity=digits;else if(/^\d{1,3}(?:[,.]\d{3})+$/.test(digits))data.quantity=digits.replace(/[,.]/g,'');}
 if(/\b(gasoil|diesel)\b/.test(q))data.product='Gasoil / Diesel';else if(/\b(essence|petrol|gasoline)\b/.test(q))data.product='Essence / Petrol';
 if(/\b(mali|bamako)\b/.test(q))data.destinationCountry='Mali';else if(/\b(senegal|dakar)\b/.test(q))data.destinationCountry='Sénégal';else if(/\b(ivoire|ivory coast|abidjan)\b/.test(q))data.destinationCountry='Côte d’Ivoire';
 const email=text.match(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/);if(email)data.email=email[0];
 // Only explicit labelled details are inferred; dates and full addresses are reviewed in their fields.
 for(const [key,pattern] of Object.entries({company:/(?:entreprise|societe|company)\s*:\s*([^;\n]+)/i,phone:/(?:telephone|tel|phone|whatsapp)\s*:\s*(\+?[\d ()-]{7,22})/i,contact:/(?:contact|responsable)\s*:\s*([^;\n]+)/i})){const match=text.match(pattern);if(match)data[key]=match[1].trim();}
 return data;
}
export function fieldError(f:Field,value:string,lang:Language):string{
 const v=value.trim(),en=lang==='en';
 if(f.required&&!v)return en?'Please complete this field.':'Veuillez renseigner ce champ.';
 if(!v)return '';
 if(v.length>600)return en?'Please use 600 characters or fewer.':'Merci de limiter la réponse à 600 caractères.';
 if(f.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))return en?'Enter a valid email address.':'Indiquez une adresse email valide.';
 if(f.type==='tel'&&!/^\+?[\d\s().-]{7,25}$/.test(v))return en?'Enter a valid phone number.':'Indiquez un numéro de téléphone valide.';
 if(f.type==='number'&&(!/^\d+(?:[.,]\d+)?$/.test(v)||Number(v.replace(',','.'))<0||(f.key!=='distance'&&Number(v.replace(',','.'))===0)))return en?'Enter a valid quantity.':'Indiquez une quantité valide.';
 return '';
}
export function requestTitle(flow:Flow,lang:Language){return {quote:{fr:'DEMANDE DE DEVIS',en:'QUOTE REQUEST'},partner:{fr:'PROPOSITION DE PARTENARIAT',en:'PARTNERSHIP PROPOSAL'},complaint:{fr:'RÉCLAMATION',en:'COMPLAINT'}}[flow][lang];}
export function requestSummary(flow:Flow,data:Record<string,string>,reference:string,lang:Language):string{
 const unknown=lang==='fr'?'À préciser':'To be confirmed';
 return `${requestTitle(flow,lang)} — TADJI ÉNERGIE\n${lang==='fr'?'Référence':'Reference'} : ${reference}\n`+requestFields[flow].map(f=>`${f[lang]} : ${data[f.key]?.trim()||(f.key==='distance'?(lang==='fr'?'À calculer':'To be calculated'):unknown)}`).join('\n')+`\n\n${lang==='fr'?'Statut : demande préparée, à transmettre pour étude. Aucun prix, stock, délai ou engagement confirmé.':'Status: request prepared, to be sent for review. No price, stock, timing or commitment confirmed.'}`;
}
