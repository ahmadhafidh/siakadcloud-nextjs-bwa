import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // redirect otomatis
  if (pathname === "/pages/auth/admin") {
    return NextResponse.redirect(new URL("/pages/auth/admin/login", req.url));
  }
  if (pathname === "/pages/auth/dosen") {
    return NextResponse.redirect(new URL("/pages/auth/dosen/login", req.url));
  }
  if (pathname === "/pages/auth/mahasiswa") {
    return NextResponse.redirect(
      new URL("/pages/auth/mahasiswa/login", req.url)
    );
  }
  if (pathname === "/pages/mahasiswa") {
    return NextResponse.redirect(
      new URL("/pages/mahasiswa/dashboard", req.url)
    );
  }
  if (pathname === "/pages/dosen") {
    return NextResponse.redirect(new URL("/pages/dosen/dashboard", req.url));
  }
  if (pathname === "/pages/admin") {
    return NextResponse.redirect(new URL("/pages/admin/dashboard", req.url));
  }

  if (pathname.startsWith("/pages/auth/")) {
    return NextResponse.next();
  }

  // ambil token dari cookie
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as "admin" | "student" | "lecture" | undefined;
    console.log("✅ [Middleware] Role:", role);

    // cek role sesuai folder
    if (pathname.startsWith("/pages/admin") && role !== "admin") {
      console.log("❌ Role bukan admin, redirect forbidden");
      return NextResponse.redirect(new URL("/pages/forbidden", req.url));
    }
    if (pathname.startsWith("/pages/mahasiswa") && role !== "student") {
      console.log("❌ Role bukan student, redirect forbidden");
      return NextResponse.redirect(new URL("/pages/forbidden", req.url));
    }
    if (pathname.startsWith("/pages/dosen") && role !== "lecture") {
      console.log("❌ Role bukan lecture, redirect forbidden");
      return NextResponse.redirect(new URL("/pages/forbidden", req.url));
    }
  } catch (e) {
    // token invalid / expired
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pages/admin/:path*",
    "/pages/mahasiswa/:path*",
    "/pages/dosen/:path*",
    "/pages/auth/:path*",
  ],
};
