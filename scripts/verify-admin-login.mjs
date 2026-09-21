import { readFileSync,writeFileSync } from 'node:fs'
const rules=readFileSync(String.raw`D:\Cursor\Grand\huanqiu-admin\AGENTS.md`,'utf8')
const password=rules.match(/初始密码统一固定为 `([^`]+)`/)?.[1]
if(!password)throw new Error('Unable to resolve approved initial password rule')
const base='https://changhong-shinelong.vercel.app'
const body=new URLSearchParams({email:'1390339757@qq.com',password})
const login=await fetch(`${base}/api/auth/login`,{method:'POST',body,redirect:'manual'})
const cookies=login.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ')
const dashboard=await fetch(`${base}/admin`,{headers:{cookie:cookies},redirect:'manual'})
const html=await dashboard.text()
const result={loginStatus:login.status,loginLocation:login.headers.get('location'),sessionCookie:cookies.includes('hq_admin_session='),tenantCookie:cookies.includes('hq_tenant_id='),dashboardStatus:dashboard.status,dashboardContainsTenant:html.includes('常州市常宏祥隆机械科技有限公司')||html.includes('常宏祥隆')}
writeFileSync(new URL('../deliverables/evidence/admin-login-verification.json',import.meta.url),JSON.stringify({...result,verifiedAt:new Date().toISOString()},null,2)+'\n','utf8')
console.log(JSON.stringify(result))
if(login.status!==303||!result.sessionCookie||!result.tenantCookie||dashboard.status!==200)process.exitCode=2
