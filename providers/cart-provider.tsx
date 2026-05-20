"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/stores/cart";

interface CartContextType {
  syncCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({ syncCart: async () => {} });

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const syncWithServer = useCartStore((s) => s.syncWithServer);

  useEffect(() => {
    if (session?.user?.email) {
      const userId = (session.user as any).id;
      if (userId) {
        syncWithServer(userId);
      }
    }
  }, [session, syncWithServer]);

  return (
    <CartContext.Provider value={{ syncCart: async () => {} }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCartContext = () => useContext(CartContext);
