import { NextRequest, NextResponse } from "next/server";
import { defaultLocale } from "./lib/i18n/config";

export function proxy(_request: NextRequest) {
	const response = NextResponse.next();
	response.headers.set("x-locale", defaultLocale);
	return response;
}

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
