import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your account profile.",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin?callbackUrl=/account/profile");

  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">My Profile</h1>
        <div className="mt-8 space-y-6 text-sm text-muted-foreground">
          <div className="rounded-lg border border-border/40 p-6">
            <h2 className="text-sm font-semibold text-foreground">Account Info</h2>
            <p className="mt-2">Name: {session.user.name ?? "Not set"}</p>
            <p className="mt-1">Email: {session.user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const runtime = "edge";
