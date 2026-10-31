import type{MetadataRoute}from'next';import{pages}from'../lib/content';import{siteUrl}from'../lib/site-url';
export default function sitemap():MetadataRoute.Sitemap{return ['fr','en'].flatMap(lang=>pages.map(page=>({url:siteUrl()+'/'+lang+'/'+(page==='accueil'?'':page),changeFrequency:'monthly' as const,priority:page==='accueil'?1:0.7})))}
