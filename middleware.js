import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const session = req.cookies.get('next-auth.session-token');

  console.log('Middleware Debug:', {
    pathname: url.pathname,
    session,
    callbackUrl: url.searchParams.get('callbackUrl'),
  });

  if (url.pathname === '/') {
    if (session) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    } else {
      url.pathname = '/api/auth/signin';
      return NextResponse.redirect(url);
    }
  }

  if (url.pathname === '/api/auth/signin' && url.searchParams.has('callbackUrl')) {
    const callbackUrl = url.searchParams.get('callbackUrl');
    url.pathname = callbackUrl ? new URL(callbackUrl).pathname : '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = { 
  matcher: [
    "/dashboard/:path*",
    "/diet-recommender/:path*",
    "/exercise-trainer/:path*",
    "/journal/:path*",
    "/progress-analysis/:path*",
    "/account/:path*"
  ]
};