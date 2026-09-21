const base='https://changhong-shinelong.vercel.app'
const paths=['/','/products','/products/tgf','/applications','/manufacturing','/about','/news','/contact','/robots.txt','/sitemap.xml','/admin/login']
const responses=await Promise.all(paths.map(async path=>{const response=await fetch(base+path);const body=await response.text();return {path,status:response.status,bytes:body.length,canonical:(body.match(/<link rel="canonical" href="([^"]+)/)||[])[1]||'',hasJsonLd:body.includes('application/ld+json'),body}}))
const captchaResponse=await fetch(`${base}/api/captcha?scope=delivery-check-1`),captcha=await captchaResponse.json()
const publicHtml=responses.filter(item=>!['/robots.txt','/sitemap.xml','/admin/login'].includes(item.path)).map(item=>item.body).join('\n').toLowerCase()
const prohibited=['warranty','warranties','guarantee','guaranteed','质保','保修','质量保证']
const sitemap=responses.find(item=>item.path==='/sitemap.xml').body
console.log(JSON.stringify({pages:responses.map(({body,...item})=>item),captcha:{status:captchaResponse.status,hasSvg:Boolean(captcha.svg),hasToken:Boolean(captcha.token),hasExpiry:Boolean(captcha.expiresAt),answerLeak:Object.hasOwn(captcha,'answer')},prohibitedHits:prohibited.filter(word=>publicHtml.includes(word)),sitemapUrls:(sitemap.match(/<loc>/g)||[]).length}))
