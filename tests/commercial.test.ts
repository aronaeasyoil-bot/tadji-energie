import {test} from 'node:test';
import assert from 'node:assert/strict';
import {faq,faqAnswer,intent,visitorLanguage} from '../lib/assistant-knowledge.ts';
import {extractDetails,fieldError,requestFields,requestSummary} from '../lib/assistant-request.ts';
test('document quote examples start qualification and preserve known details',()=>{
 for(const question of ['Je veux un devis','Combien coûte 50 000 litres de gasoil ?','Pouvez-vous livrer du carburant à Bamako ?','Je souhaite commander du diesel','Je souhaite 50 000 litres de gasoil à Bamako'])assert.equal(intent(question),'quote');
 assert.deepEqual(extractDetails('Je souhaite 50 000 litres de gasoil à Bamako'),{quantity:'50000',product:'Gasoil / Diesel',destinationCountry:'Mali'});
 assert.equal(extractDetails('I need 100,000 litres of diesel').quantity,'100000');
 assert.equal(extractDetails('50 litres de diesel; email: client@example.com').email,'client@example.com');
});
test('FAQ covers source topics without invented price or delivery commitments',()=>{
 assert.equal(faq.length,20);
 assert.match(faqAnswer('Quel est le prix du gasoil ?','fr'),/Aucun tarif/);
 assert.match(faqAnswer('Quelle quantité minimale ?','fr'),/minimale dépend/);
 assert.match(faqAnswer('Quels délais pour une livraison ?','fr'),/Aucun délai ferme/);
 assert.match(faqAnswer('Quelles certifications ?','fr'),/ne confirme aucun/);
 assert.match(faqAnswer('comment vous contacter','fr'),/bako@tadji.energy/);
 assert.match(faqAnswer('anything unrelated','en'),/commercial team/);
 assert.equal(visitorLanguage('What are your prices?','fr'),'en');
 assert.equal(visitorLanguage('Je souhaite un devis','en'),'fr');
});
test('partnership and complaints take distinct paths',()=>{
 assert.equal(intent('Devenir partenaire'),'partner');
 assert.equal(intent('Réclamation : erreur de livraison'),'complaint');
 assert.equal(intent('late delivery'),'complaint');
 assert.match(faqAnswer('Je souhaite un remboursement','fr'),/Aucun remboursement/);
});
test('required contact fields validated; unknown distance never blocks; summary is not a receipt',()=>{
 assert.ok(fieldError(requestFields.quote.find(f=>f.key==='email')!,'not-an-email','fr'));
 assert.ok(fieldError(requestFields.quote.find(f=>f.key==='quantity')!,'-5','fr'));
 assert.equal(fieldError(requestFields.quote.find(f=>f.key==='distance')!,'','fr'),'');
 const summary=requestSummary('quote',{company:'Example',quantity:'50000'},'TE-TEST','fr');
 assert.match(summary,/TE-TEST/);assert.match(summary,/À calculer/);assert.match(summary,/à transmettre/);assert.doesNotMatch(summary,/Demande reçue/);
});
