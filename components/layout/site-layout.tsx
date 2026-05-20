"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart";
import { Header } from "./header";
import { Footer } from "./footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDialog } from "./search-dialog";
import { AnnouncementBar } from "./announcement-bar";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<{ announcementText?: string; announcementEnabled?: boolean }>({});
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d))
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar text={settings.announcementText} isActive={settings.announcementEnabled} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchDialog />
    </div>
  );
}
