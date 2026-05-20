"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart";
import { useWishlistStore } from "@/stores/wishlist";
import { useUIStore } from "@/stores/ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { navigation } from "@/config/navigation";

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const cartCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openSearch } =
    useUIStore();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center"
        >
          <img src="/logo.png" alt="KAIRO" className="h-16 w-auto" />
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.name}
                {pathname === item.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-md bg-accent/60"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={openSearch}
            aria-label="Search"
            className="h-9 w-9"
          >
            <Search className="h-[18px] w-[18px]" />
          </Button>

          <Link href="/wishlist" className="hidden sm:block">
            <Button variant="ghost" size="icon" aria-label="Wishlist" className="h-9 w-9">
              <div className="relative">
                <Heart className="h-[18px] w-[18px]" />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-foreground text-[9px] font-medium text-background">
                    {wishlistCount}
                  </span>
                )}
              </div>
            </Button>
          </Link>

          {session?.user ? (
            <Link
              href={isAdmin ? "/admin/dashboard" : "/account"}
              className="hidden sm:block"
            >
              <Button variant="ghost" size="icon" aria-label="Account" className="h-9 w-9">
                <User className="h-[18px] w-[18px]" />
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login" className="hidden sm:block">
              <Button variant="ghost" size="icon" aria-label="Sign in" className="h-9 w-9">
                <User className="h-[18px] w-[18px]" />
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            aria-label="Cart"
            className="h-9 w-9"
          >
            <div className="relative">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-foreground text-[9px] font-medium text-background">
                  {cartCount}
                </span>
              )}
            </div>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMobileMenu}
            className="h-9 w-9 md:hidden"
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="h-[18px] w-[18px]" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="h-[18px] w-[18px]" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border/40 bg-background md:hidden"
          >
            <nav className="flex flex-col gap-0.5 px-4 pb-4 pt-3">
              {navigation.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      pathname === item.href
                        ? "bg-accent/60 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
              <div className="my-2 border-t border-border/40" />
              <Link
                href="/wishlist"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Wishlist ({wishlistCount})
              </Link>
              {session?.user ? (
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/account"}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Account
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
