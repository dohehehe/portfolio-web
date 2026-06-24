import { NextResponse } from "next/server";
import { isAdminUser } from "@/lib/auth/constants";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/")) {
    if (!isAdminUser(user)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
