import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "./lib/i18n/config";

export function middleware(request: NextRequest) {
  // Obtener locale de la cookie
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  const locale = locales.includes(localeCookie as any)
    ? localeCookie
    : defaultLocale;

  // Crear response
  const response = NextResponse.next();

  // Set header para que i18n lo use
  response.headers.set("x-locale", locale as string);

  // Asegurar que la cookie esté presente
  if (!localeCookie) {
    response.cookies.set("NEXT_LOCALE", defaultLocale, {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
