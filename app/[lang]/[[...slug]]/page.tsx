import {siteUrl} from '../../../lib/site-url';
import Site from '../../../components/site';
import {copy,pages,type Lang} from '../../../lib/content';
import {notFound} from 'next/navigation';
type Props={params:Promise<{lang:string,slug?:string[]}>};
export async function generateMetadata({params}:Props){const {lang,slug}=await params;const l=lang==='en'?'en':'fr';const p=slug?.[0]||'accueil';const i=pages.indexOf(p as typeof pages[number]);const base=siteUrl();const path=p==='accueil'?'':p;return {title:`${copy[l].nav[i]||'TADJI ÉNERGIE'} | TADJI ÉNERGIE`,description:copy[l].intro,alternates:{canonical:`${base}/${l}/${path}`,languages:{fr:`${base}/fr/${path}`,en:`${base}/en/${path}`}},openGraph:{title:`${copy[l].nav[i]} | TADJI ÉNERGIE`,description:copy[l].intro,images:[`${base}/images/hero.webp`]},robots:{index:true,follow:true}}}
export default async function Page({params}:Props){const {lang,slug}=await params;const page=slug?.[0]||'accueil';if(!['fr','en'].includes(lang)||!pages.includes(page as typeof pages[number])||(slug?.length||0)>1)notFound();return <Site lang={lang as Lang} page={page}/>}
