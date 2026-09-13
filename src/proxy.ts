import { NextResponse, type NextRequest } from "next/server";

function externalOrigin(request: NextRequest) {
  const host = request.headers.get("host") ?? request.headers.get("x-forwarded-host") ?? request.nextUrl.host;
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return `${protocol}://${host}`;
}

function publicPath(pathname: string) {
  if (pathname === "/id" || pathname === "/en") return "/";
  if (pathname.startsWith("/id/") || pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}

function addLocaleHeaders(response: NextResponse, request: NextRequest, locale: "en" | "id") {
  const origin = externalOrigin(request);
  const pathname = publicPath(request.nextUrl.pathname);
  const english = `${origin}${pathname}`;
  const indonesian = `${origin}/id${pathname === "/" ? "" : pathname}`;
  response.headers.set("link", `<${english}>; rel="alternate"; hreflang="en", <${indonesian}>; rel="alternate"; hreflang="id", <${english}>; rel="alternate"; hreflang="x-default"`);
  response.cookies.set("NEXT_LOCALE", locale, { path: "/", sameSite: "lax" });
  return response;
}

export default function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const rewrittenLocale = request.headers.get("x-next-intl-locale");

  if (pathname === "/en" || pathname.startsWith("/en/")) {
    if (rewrittenLocale === "en") {
      return NextResponse.next();
    }

    const destination = new URL(publicPath(pathname), externalOrigin(request));
    destination.search = request.nextUrl.search;
    return addLocaleHeaders(NextResponse.redirect(destination, 308), request, "en");
  }

  if (pathname === "/id" || pathname.startsWith("/id/")) {
    const headers = new Headers(request.headers);
    headers.set("x-next-intl-locale", "id");
    return addLocaleHeaders(NextResponse.next({ request: { headers } }), request, "id");
  }

  const destination = new URL(`/en${pathname === "/" ? "" : pathname}`, externalOrigin(request));
  destination.search = request.nextUrl.search;
  const headers = new Headers(request.headers);
  headers.set("x-next-intl-locale", "en");
  return addLocaleHeaders(NextResponse.rewrite(destination, { request: { headers } }), request, "en");
}

export const config = {
  matcher: "/((?!api|studio|_next|.*\\..*).*)",
};
