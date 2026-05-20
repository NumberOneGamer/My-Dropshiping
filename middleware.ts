import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!session?.user) {
      return Response.redirect(new URL("/auth/login", request.url));
    }
    if ((session.user as any)?.role !== "ADMIN") {
      return Response.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/account") || pathname.startsWith("/wishlist")) {
    if (!session?.user) {
      return Response.redirect(new URL("/auth/login", request.url));
    }
  }

  return;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*", "/wishlist"],
};
