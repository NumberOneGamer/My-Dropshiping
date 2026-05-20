"use client";

import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart";
import { Header } from "./header";
import { Footer } from "./footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchDialog } from "./search-dialog";
import { AnnouncementBar } from "./announcement-bar";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  const announcementText = "Free shipping on orders over $50";
  const announcementEnabled = true;

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar text={announcementText} isActive={announcementEnabled} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
      <SearchDialog />
    </div>
  );
}
