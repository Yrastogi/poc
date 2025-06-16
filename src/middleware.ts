import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'app_session';
const LOGIN_PATH = '/';
const PROTECTED_PATHS = ['/dashboard', '/bank-form'];

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  if (!sessionCookie && isProtectedPath) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionCookie && pathname === LOGIN_PATH) {
     const defaultProtectedRoute = new URL('/bank-form', request.url);
     return NextResponse.redirect(defaultProtectedRoute);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|qualtechedge_logo.jpeg).*)',
  ],
};
