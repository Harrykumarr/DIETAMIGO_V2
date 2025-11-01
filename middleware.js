import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const session = req.cookies.get('next-auth.session-token');

  if (url.pathname === '/') {
    if (session) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    } else {
      url.pathname = '/api/auth/signin';
      return NextResponse.redirect(url);
    }
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