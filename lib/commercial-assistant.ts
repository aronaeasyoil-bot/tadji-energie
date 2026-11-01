export function answerQuestion(question:string,lang:'fr'|'en',answers:string[]):string{
 const en=lang==='en';
 const q=question.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 if(/\b(prix|tarif\w*|cout\w*|combien|disponib\w*|price|cost|stock|available|availability)\b/.test(q))return en?'Prices and availability depend on your request. Please provide the product, quantity, destination and deadline. Our team will prepare a quote with you on WhatsApp.':'Les prix et disponibilités dépendent de votre demande. Précisez le produit, la quantité, la destination et le délai souhaité. Notre équipe préparera votre devis avec vous sur WhatsApp.';
 if(/\b(devis|quote|quotation|commande|commander|acheter|achat|buy|order)\b/.test(q))return answers[2];
 if(/\b(pays|marche\w*|senegal|mali|ivoire|afri\w*|country|countries|market\w*|where|ou)\b/.test(q))return answers[1];
 if(/\b(service\w*|activite\w*|approvisionnement|logistique|maritime|port\w*|transport\w*|distribution|sourcing|petrol\w*|carburant\w*|fuel|diesel|gasoil|essence)\b/.test(q))return answers[0];
 if(/\b(contact\w*|telephone|numero|email|mail|whatsapp|phone|number)\b/.test(q))return 'Email : info@tadji.energy · WhatsApp Sénégal : +221 77 490 98 98 · WhatsApp Mali : +223 77 00 66 66.';
 if(/\b(bonjour|bonsoir|salut|hello|hi)\b/.test(q))return en?'Hello! How can we help? Choose services, countries or a quote request above.':'Bonjour ! Comment pouvons-nous vous aider ? Choisissez nos services, les pays accompagnés ou une demande de devis ci-dessus.';
 return en?'Our team can help with this specific question. Contact us using the WhatsApp link below, or choose one of the topics above.':'Notre équipe pourra vous accompagner sur cette question précise. Contactez-nous avec le lien WhatsApp ci-dessous, ou choisissez un des sujets proposés.';
}
