import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Language, ViewMode } from "@/types";

interface TreeState {
  view: ViewMode;
  setView: (v: ViewMode) => void;

  language: Language;
  setLanguage: (l: Language) => void;

  selectedId: string | null;
  select: (id: string | null) => void;

  search: string;
  setSearch: (s: string) => void;

  learned: Record<string, boolean>;
  toggleLearned: (id: string) => void;

  ollamaUrl: string;
  setOllamaUrl: (url: string) => void;

  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  compareIds: string[];
  toggleCompare: (id: string) => void;
  setCompareSlot: (slot: 0 | 1, id: string) => void;
  clearCompare: () => void;
  compareOpen: boolean;
  setCompareOpen: (open: boolean) => void;
}

export const useTreeStore = create<TreeState>()(
  persist(
    (set) => ({
      view: "tree",
      setView: (view) => set({ view }),

      language: "de",
      setLanguage: (language) => set({ language }),

      selectedId: null,
      select: (selectedId) => set({ selectedId, sidebarOpen: !!selectedId }),

      search: "",
      setSearch: (search) => set({ search }),

      learned: {},
      toggleLearned: (id) =>
        set((s) => ({ learned: { ...s.learned, [id]: !s.learned[id] } })),

      ollamaUrl: "http://localhost:11434",
      setOllamaUrl: (ollamaUrl) => set({ ollamaUrl }),

      sidebarOpen: false,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      compareIds: [],
      toggleCompare: (id) =>
        set((s) => {
          if (s.compareIds.includes(id)) {
            return { compareIds: s.compareIds.filter((x) => x !== id) };
          }
          const next = [...s.compareIds, id];
          // Bei drittem Klick den ältesten Eintrag verwerfen (FIFO)
          if (next.length > 2) next.shift();
          return { compareIds: next };
        }),
      setCompareSlot: (slot, id) =>
        set((s) => {
          const next = [...s.compareIds];
          if (slot < next.length) next[slot] = id;
          else next.push(id);
          return { compareIds: next.slice(0, 2) };
        }),
      clearCompare: () => set({ compareIds: [], compareOpen: false }),
      compareOpen: false,
      setCompareOpen: (compareOpen) => set({ compareOpen }),
    }),
    { name: "tree-of-knowledge-store" }
  )
);
