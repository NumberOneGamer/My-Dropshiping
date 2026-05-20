"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Services } from "./services";

export function ClientAdminCheck() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "ADMIN";

  if (!isAdmin) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-lg"
      >
        Admin
      </Link>
    </div>
  );
}
