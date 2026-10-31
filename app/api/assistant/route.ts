// Inference runs on the visitor device; no billed provider calls.
export async function POST(){return Response.json({error:'local_ai_only'},{status:410});}
