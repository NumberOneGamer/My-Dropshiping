import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

const secret = process.env.AUTH_SECRET || (typeof crypto !== "undefined" ? crypto.randomUUID?.() : "dev-secret-at-least-32-chars-long!!");

const config = { secret,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        const isValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
    async signIn({ user }: any) {
      if (user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
            },
          });
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: { strategy: "jwt" },
};

let _auth: any = null;
function getAuth() {
  if (!_auth) {
    try {
      // @ts-expect-error
      _auth = NextAuth(config);
    } catch (e) {
      console.error("Auth initialization failed:", e);
      throw e;
    }
  }
  return _auth;
}

export const handlers = { GET: (req: Request) => getAuth().handlers.GET(req), POST: (req: Request) => getAuth().handlers.POST(req) };
export const signIn = (...args: any[]) => getAuth().signIn(...args);
export const signOut = (...args: any[]) => getAuth().signOut(...args);
export const auth = (...args: any[]) => getAuth().auth(...args);
