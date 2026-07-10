import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/auth/constants";
import {
  getInternalLocalePath,
  getLocaleFromPathname,
  LOCALE_HEADER,
  shouldSkipLocaleRouting,
} from "@/lib/locale/routing";
import { updateSession } from "@/lib/supabase/middleware";

function applyCookies(target, source) {
  source.cookies.getAll().forEach(({ name, value, ...options }) => {
    target.cookies.set(name, value, options);
  });
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const { supabaseResponse, user } = await updateSession(request);

  if (pathname.startsWith("/admin/")) {
    if (!isAdminUser(user)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  if (shouldSkipLocaleRouting(pathname)) {
    return supabaseResponse;
  }

  if (pathname === "/ko" || pathname.startsWith("/ko/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/ko" ? "/" : pathname.slice(3) || "/";
    const response = NextResponse.redirect(url);
    applyCookies(response, supabaseResponse);
    return response;
  }

  const locale = getLocaleFromPathname(pathname);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LOCALE_HEADER, locale);

  let response;

  if (locale === "en") {
    response = NextResponse.next({
      request: { headers: requestHeaders },
    });
  } else {
    const rewritePath = getInternalLocalePath(pathname, "ko");
    const rewriteUrl = new URL(`${rewritePath}${request.nextUrl.search}`, request.url);

    response = NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  applyCookies(response, supabaseResponse);
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
