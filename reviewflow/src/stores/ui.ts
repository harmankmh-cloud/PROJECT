import { create } from "zustand";

type UiState = {
  pricingAnnual: boolean;
  sidebarOpen: boolean;
  setPricingAnnual: (annual: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  pricingAnnual: false,
  sidebarOpen: false,
  setPricingAnnual: (annual) => set({ pricingAnnual: annual }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
