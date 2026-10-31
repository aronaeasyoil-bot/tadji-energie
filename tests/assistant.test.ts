import {test} from 'node:test';
import assert from 'node:assert/strict';
import {POST} from '../app/api/assistant/route.ts';
test('retired assistant endpoint never contacts a paid provider',async()=>{
 const previous=globalThis.fetch;
 globalThis.fetch=async()=>{throw Error('Unexpected network call');};
 try{const response=await POST();assert.equal(response.status,410);assert.deepEqual(await response.json(),{error:'local_ai_only'});}
 finally{globalThis.fetch=previous;}
});
