import { NextResponse,type NextRequest } from 'next/server'
import { isServiceGuardExcludedPath,isWebsiteServiceAvailable } from '@/lib/service-status'
export async function applyServiceExpiryGuard(request:NextRequest):Promise<NextResponse|null>{if(isServiceGuardExcludedPath(request.nextUrl.pathname))return null;if(await isWebsiteServiceAvailable())return null;const url=request.nextUrl.clone();url.pathname='/service-expired';return NextResponse.rewrite(url)}
