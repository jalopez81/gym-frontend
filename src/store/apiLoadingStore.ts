import { create } from "zustand";

type ApiLoadingState = {
  pending: number;
  beginRequest: () => void;
  endRequest: () => void;
};

export const useApiLoadingStore = create<ApiLoadingState>((set) => ({
  pending: 0,
  beginRequest: () => set((s) => ({ pending: s.pending + 1 })),
  endRequest: () => set((s) => ({ pending: Math.max(0, s.pending - 1) })),
}));
