import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const { user, response } = await updateSession(request);

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");
  const isProtectedPath = [
    "/dashboard",
    "/projects",
    "/tasks",
    "/settings",
    "/contacts",
  ].some((path) => request.nextUrl.pathname.startsWith(path));

  // If user is NOT logged in and trying to access a protected route
  if (!user && isProtectedPath) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // If user IS logged in and trying to access login page
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  // If user IS logged in and hits the root marketing page (per user request) -> Redirect to dashboard
  if (user && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
