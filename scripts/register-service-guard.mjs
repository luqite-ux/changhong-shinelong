import { existsSync,readFileSync,writeFileSync,mkdirSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'
for(const file of [String.raw`D:\Cursor\Grand\huanqiu-admin\.env`,String.raw`D:\Cursor\Grand\huanqiu-admin\.env.local`]){if(!existsSync(file))continue;for(const line of readFileSync(file,'utf8').split(/\r?\n/)){const m=line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);if(!m)continue;process.env[m[1]]??=m[2].trim().replace(/^['"]|['"]$/g,'')}}
const tenantId='2b7ece95-e14a-48d8-a08c-0a9fea55710e',guardVersion='1'
const db=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false}})
const payload={tenant_id:tenantId,expires_on:null,enforcement_enabled:false,guard_version:guardVersion}
const {error}=await db.from('tenant_service_terms').upsert(payload,{onConflict:'tenant_id'});if(error)throw error
const {data,error:readError}=await db.from('tenant_service_terms').select('tenant_id,expires_on,enforcement_enabled,guard_version').eq('tenant_id',tenantId).single();if(readError)throw readError
if(data.expires_on!==null||data.enforcement_enabled!==false||data.guard_version!==guardVersion)throw new Error('Unsafe or mismatched service guard readback')
mkdirSync(new URL('../deliverables/evidence/',import.meta.url),{recursive:true})
writeFileSync(new URL('../deliverables/evidence/service-guard-registration.json',import.meta.url),JSON.stringify({...data,verified_at:new Date().toISOString()},null,2)+'\n','utf8')
console.log(JSON.stringify({tenantId:data.tenant_id,expiresOn:data.expires_on,enforcementEnabled:data.enforcement_enabled,guardVersion:data.guard_version}))
