import { create } from "zustand";

interface UIState {
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  recentlyViewed: string[];
  openSearch: () => void;
  closeSearch: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  addRecentlyViewed: (slug: string) => void;
}

export const useUIStore = create<UIState>()((set, get) => ({
  isSearchOpen: false,
  isMobileMenuOpen: false,
  recentlyViewed: [],

  openSearch: () => set({ isSearchOpen: true }),
  closeSearch: () => set({ isSearchOpen: false }),

  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  addRecentlyViewed: (slug) => {
    const { recentlyViewed } = get();
    const updated = [slug, ...recentlyViewed.filter((s) => s !== slug)].slice(
      0,
      8
    );
    set({ recentlyViewed: updated });
  },
}));
