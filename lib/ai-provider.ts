export const GATEWAY_ENDPOINT='https://ai-gateway.vercel.sh/v1/chat/completions';
export const GATEWAY_MODEL='google/gemini-2.5-flash-lite';

export function providerFailure(status:number,message:string){
  if(status===403&&/credit card|billing|unlock.*credits/i.test(message))return 'provider_activation_required';
  if(status===402)return 'provider_credits_exhausted';
  if(status===429)return 'provider_rate_limit';
  return 'provider_unavailable';
}
