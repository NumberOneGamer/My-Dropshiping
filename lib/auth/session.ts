import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth(role?: UserRole) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (role && (user as any).role !== role) redirect("/");
  return user;
}

export async function requireAdmin() {
  return requireAuth("ADMIN");
}

export async function getSessionUserId(): Promise<string | undefined> {
  const user = await getCurrentUser();
  return (user as any)?.id;
}
