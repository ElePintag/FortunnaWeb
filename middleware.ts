import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';

  if (hostname === 'admin.fortunnainmobiliaria.com.ec') {
    if (request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (!request.nextUrl.pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
