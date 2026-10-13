import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

/**
 * Language routing. Every visitor gets the default language (Serbian) at "/",
 * whatever their browser language; English lives under "/en".
 * - "/blog/x"    → served from app/[lang] with lang = "sr" (rewrite, URL unchanged)
 * - "/en/blog/x" → served as is
 * - "/sr/blog/x" → redirected to "/blog/x", so each page has one public URL
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first === defaultLocale) {
    // Generated metadata images keep their internal URL (/sr/opengraph-image…).
    if (pathname.includes("/opengraph-image")) return;
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (isLocale(first)) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next.js internals and files with an extension (images, sitemap.xml, robots.txt, icon.svg…).
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
