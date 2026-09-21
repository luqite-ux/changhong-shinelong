import { createClient, type SupabaseClient } from '@supabase/supabase-js'
let client: SupabaseClient | null | undefined
export function getSupabaseClient(){if(client!==undefined)return client;const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;client=url&&key?createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}}):null;return client}
export function getTenantId(){return process.env.NEXT_PUBLIC_TENANT_ID?.trim()??''}
