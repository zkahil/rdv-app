import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Si pas de token et accès à une page protégée
    if (!token) {
      if (
       
        path.startsWith("/dashboard")
      ) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      return NextResponse.next();
    }

    const role = (token.role as string)?.toUpperCase();
    console.log("👤 Rôle du token:", role);

    // Admin essaie d'accéder à une page vendeur
    if (role === "ADMIN" && path.startsWith("/vendeur")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Vendeur essaie d'accéder à une page admin
    if (role === "VENDEUR" && path.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/produits", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Pages publiques
        if (
          path === "/login" ||
          path.startsWith("/api/auth") ||
          path === "/"
        ) {
          return true;
        }
        // Pages protégées
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    
    "/dashboard/:path*",
    "/login",
  ],
};