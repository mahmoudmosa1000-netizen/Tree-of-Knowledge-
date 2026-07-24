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
    }),
    { name: "tree-of-knowledge-store" }
  )
);
