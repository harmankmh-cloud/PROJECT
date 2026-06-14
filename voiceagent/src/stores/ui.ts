import { create } from "zustand";

type UiState = {
  sidebarOpen: boolean;
  pricingAnnual: boolean;
  demoBannerVisible: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  setPricingAnnual: (annual: boolean) => void;
  setDemoBannerVisible: (visible: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: false,
  pricingAnnual: false,
  demoBannerVisible: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setPricingAnnual: (annual) => set({ pricingAnnual: annual }),
  setDemoBannerVisible: (visible) => set({ demoBannerVisible: visible }),
}));
