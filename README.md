# TADJI ÉNERGIE

Site corporate bilingue Next.js, déployable sur Vercel. Sept pages principales, deux pages légales, formulaire de préparation de demande WhatsApp/email, carte indicative et assistant commercial.

## Développement
`npm ci`, puis `npm run dev`. Vérifications : `npm test`, `npm run build`.

## Vercel
La branche `main` est destinée à la production. Configurer le projet comme Next.js, build `npm run build`, installation `npm ci`.

Les textes sont dans `lib/content.ts`. L’administration `/admin` les enregistre dans un stockage Vercel Blob privé. `ADMIN_SECRET` doit contenir une valeur aléatoire d’au moins 32 caractères, conservée uniquement dans les variables d’environnement Vercel. Le code de connexion n’est jamais inclus dans Git. Les sessions sont signées, expirent après 8 heures et sont stockées dans un cookie HttpOnly, Secure en production, SameSite Strict. Les écritures refusent les origines externes et les visiteurs non authentifiés.

Les images WebP et logos SVG se trouvent dans `public/images` et `public/brand`. Les images sont conceptuelles et ne prouvent pas la propriété de véhicules, navires, installations ou la présence d’une équipe réelle. Prompts : `PROMPTS.md`.

## Assistant
Le guide commercial est utilisable immédiatement. La conversation IA requiert `AI_ENDPOINT`, `AI_MODEL` et `AI_API_KEY`, ainsi que le stockage Blob pour le quota de 100 requêtes quotidiennes. Sans configuration, elle annonce son indisponibilité. Les réponses ne confirment ni prix ni disponibilité.

## Formulaires
Préparent un message dans WhatsApp ou la messagerie du visiteur ; l’envoi final reste effectué par celui-ci. Aucune fausse confirmation d’envoi. Sénégal : +221 77 490 98 98 ; Mali : +223 77 00 66 66.

## Finalisation éditoriale
Compléter les informations de société et de confidentialité, confirmer toute implantation ou autorisation, puis raccorder le domaine `www.tadji.energy` auprès de son gestionnaire DNS. Les liens publics et métadonnées utilisent l’URL de production Vercel ou `NEXT_PUBLIC_SITE_URL`.
