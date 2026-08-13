import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface User {
    role: string;
    slug?: string;
  }
  interface Session {
    user: User & {
      role: string;
      slug?: string;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        console.log("🔐 Tentative de connexion:", credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Email ou mot de passe manquant");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        console.log("👤 Utilisateur trouvé:", user ? user.email : "non trouvé");
        console.log("📋 Rôle:", user?.role);

        if (!user || !user.password) {
          console.log("❌ Utilisateur non trouvé ou pas de mot de passe");
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        console.log("🔑 Mot de passe valide:", isValid);

        if (!isValid) {
          return null;
        }

        console.log("✅ Authentification réussie pour:", user.email);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          slug: user.slug,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("📝 JWT Callback - User:", user);
      if (user) {
        token.role = user.role;
        token.slug = user.slug;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      console.log("📝 Session Callback - Token:", token);
      if (session.user) {
        session.user.role = token.role as string;
        session.user.slug = token.slug as string;
        session.user.id = token.id as string;
      }
      console.log("📝 Session Callback - Session:", session);
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export async function getSession() {
  const { getServerSession } = await import("next-auth");
  return getServerSession(authOptions);
}