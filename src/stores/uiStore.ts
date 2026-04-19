import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TabType } from "@/types/engram";

interface UIState {
  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;

  // Modals
  settingsModalOpen: boolean;
  mergeProjectsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
  setMergeProjectsModalOpen: (open: boolean) => void;

  // Active tab
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  // Filters
  projectFilter: string | null;
  typeFilter: string | null;
  setProjectFilter: (project: string | null) => void;
  setTypeFilter: (type: string | null) => void;
  clearFilters: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Theme
      theme: "system",
      setTheme: (theme) => set({ theme }),

      // Modals
      settingsModalOpen: false,
      mergeProjectsModalOpen: false,
      setSettingsModalOpen: (open) => set({ settingsModalOpen: open }),
      setMergeProjectsModalOpen: (open) => set({ mergeProjectsModalOpen: open }),

      // Active tab
      activeTab: "sessions",
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Filters
      projectFilter: null,
      typeFilter: null,
      setProjectFilter: (project) => set({ projectFilter: project }),
      setTypeFilter: (type) => set({ typeFilter: type }),
      clearFilters: () => set({ projectFilter: null, typeFilter: null }),
    }),
    {
      name: "engram-desktop-ui",
    }
  )
);
