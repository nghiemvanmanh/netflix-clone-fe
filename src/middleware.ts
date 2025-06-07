import { NextRequest, NextResponse } from "next/server";
import parseJwt from "../utils/token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const selectedProfile = request.cookies.get("selectedProfile")?.value;
  const url = request.nextUrl.clone();
  const sessionId = request.nextUrl.searchParams.get("session_id");

  // ⛔ Chưa login → redirect login
  if (!accessToken && !["/login", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Đã login → kiểm tra user
  if (accessToken) {
    const user = parseJwt(accessToken);

    const isActive = user?.isActive;
    const isExpired = user?.exp && user.exp * 1000 < Date.now();
    if (isExpired) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    if (
      pathname.startsWith("/subscription/success") ||
      pathname.startsWith("/subscription/cancel")
    ) {
      if (!sessionId) {
        return NextResponse.redirect(new URL("/subscription", request.url));
      }

      // Nếu đã active mà vào success/cancel → redirect về /profiles
      if (isActive) {
        return NextResponse.redirect(new URL("/profiles", request.url));
      }

      return NextResponse.next();
    }
    if (!isActive && pathname !== "/subscription") {
      return NextResponse.redirect(new URL("/subscription", request.url));
    }
    if (isActive && !selectedProfile && pathname !== "/profiles") {
      return NextResponse.redirect(new URL("/profiles", request.url));
    }

    // ✅ Đã có profile → mà vào lại /profiles → chuyển về /home
    if (selectedProfile && pathname === "/profiles") {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (selectedProfile && ["/login", "/register"].includes(pathname)) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|netflix-background.jpg|avatars).*)"],
};
