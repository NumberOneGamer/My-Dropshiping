import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export { authConfig as auth };
export const { auth: middleware } = NextAuth(authConfig);
