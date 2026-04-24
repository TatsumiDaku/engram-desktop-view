import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;

	language: "es" | "en" | "pt";
	setLanguage: (lang: "es" | "en" | "pt") => void;

	settingsModalOpen: boolean;
	mergeProjectsModalOpen: boolean;
	shortcutsModalOpen: boolean;
	compactModalOpen: boolean;
	setSettingsModalOpen: (open: boolean) => void;
	setMergeProjectsModalOpen: (open: boolean) => void;
	setShortcutsModalOpen: (open: boolean) => void;
	setCompactModalOpen: (open: boolean) => void;

	autoRefresh: boolean;
	setAutoRefresh: (enabled: boolean) => void;

	projectFilter: string | null;
	typeFilter: string | null;
	scopeFilter: string | null;
	setProjectFilter: (project: string | null) => void;
	setTypeFilter: (type: string | null) => void;
	setScopeFilter: (scope: string | null) => void;
	clearFilters: () => void;
}

export const useUIStore = create<UIState>()(
	persist(
		(set) => ({
			theme: "dark",
			setTheme: (theme) => {
				set({ theme });
				if (theme === "dark") {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}
			},

			language: "es",
			setLanguage: (language) => {
				set({ language });
				localStorage.setItem("engram-language", language);
			},

			settingsModalOpen: false,
			mergeProjectsModalOpen: false,
			shortcutsModalOpen: false,
			compactModalOpen: false,
			setSettingsModalOpen: (open) => set({ settingsModalOpen: open }),
			setMergeProjectsModalOpen: (open) =>
				set({ mergeProjectsModalOpen: open }),
			setShortcutsModalOpen: (open) => set({ shortcutsModalOpen: open }),
			setCompactModalOpen: (open) => set({ compactModalOpen: open }),

			autoRefresh: true,
			setAutoRefresh: (enabled) => set({ autoRefresh: enabled }),

			projectFilter: null,
			typeFilter: null,
			scopeFilter: null,
			setProjectFilter: (project) => set({ projectFilter: project }),
			setTypeFilter: (type) => set({ typeFilter: type }),
			setScopeFilter: (scope) => set({ scopeFilter: scope }),
			clearFilters: () => set({ projectFilter: null, typeFilter: null, scopeFilter: null }),
		}),
		{
			name: "engram-desktop-ui",
			onRehydrateStorage: () => (state) => {
				if (state && state.theme === "dark") {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}
			},
		},
	),
);
