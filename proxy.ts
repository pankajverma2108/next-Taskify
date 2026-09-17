import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = (pathname: string) =>
  pathname === "/" || pathname === "/demo" || pathname === "/api/webhook" || pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, redirectToSignIn } = await auth();
  const publicRoute = isPublicRoute(req.nextUrl.pathname);

  if (userId && req.nextUrl.pathname === "/") {
    const path = orgId ? `/organization/${orgId}` : "/select-org";
    return NextResponse.redirect(new URL(path, req.url));
  }

  if (!userId && !publicRoute) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (userId && !orgId && !publicRoute && !req.nextUrl.pathname.startsWith("/select-org")) {
    return NextResponse.redirect(new URL("/select-org", req.url));
  }
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
