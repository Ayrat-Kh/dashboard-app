import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { CookieKeys, TursoParams } from './constants/Keys';
import { TURSO_LOGIN_URL } from './constants/PublicUrls';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  if (
    searchParams.has(TursoParams.AuthToken) &&
    searchParams.has(TursoParams.Username)
  ) {
    const response = NextResponse.next();
    response.cookies.set({
      name: CookieKeys.AccessToken,
      value: searchParams.get(TursoParams.AuthToken) ?? '',
    });
    return response;
  }

  if (!request.cookies.has(CookieKeys.AccessToken)) {
    const url = new URL(TURSO_LOGIN_URL);
    url.searchParams.set(TursoParams.Port, request.nextUrl.port);
    url.searchParams.set(TursoParams.RedirectUrl, 'true');

    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
