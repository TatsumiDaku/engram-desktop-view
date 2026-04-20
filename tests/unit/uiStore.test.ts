import { describe, it, expect } from "vitest";
import { useUIStore } from "@/stores/uiStore";

describe("uiStore", () => {
	describe("theme", () => {
		it("should default to dark theme", () => {
			const state = useUIStore.getState();
			expect(state.theme).toBe("dark");
		});

		it("should set theme", () => {
			const { setTheme } = useUIStore.getState();
			setTheme("light");
			expect(useUIStore.getState().theme).toBe("light");
			setTheme("dark"); // reset
		});
	});

	describe("language", () => {
		it("should default to spanish", () => {
			const state = useUIStore.getState();
			expect(state.language).toBe("es");
		});

		it("should set language", () => {
			const { setLanguage } = useUIStore.getState();
			setLanguage("en");
			expect(useUIStore.getState().language).toBe("en");
			setLanguage("es"); // reset
		});
	});

	describe("filters", () => {
		it("should set project filter", () => {
			const { setProjectFilter } = useUIStore.getState();
			setProjectFilter("my-project");
			expect(useUIStore.getState().projectFilter).toBe("my-project");
		});

		it("should clear all filters", () => {
			const { setProjectFilter, setTypeFilter, setScopeFilter, clearFilters } =
				useUIStore.getState();
			setProjectFilter("project");
			setTypeFilter("bugfix");
			setScopeFilter("project");
			clearFilters();
			const state = useUIStore.getState();
			expect(state.projectFilter).toBeNull();
			expect(state.typeFilter).toBeNull();
			expect(state.scopeFilter).toBeNull();
		});
	});

	describe("modals", () => {
		it("should toggle settings modal", () => {
			const { setSettingsModalOpen } = useUIStore.getState();
			setSettingsModalOpen(true);
			expect(useUIStore.getState().settingsModalOpen).toBe(true);
			setSettingsModalOpen(false);
			expect(useUIStore.getState().settingsModalOpen).toBe(false);
		});
	});

	describe("autoRefresh", () => {
		it("should default to true", () => {
			const state = useUIStore.getState();
			expect(state.autoRefresh).toBe(true);
		});

		it("should toggle auto refresh", () => {
			const { setAutoRefresh } = useUIStore.getState();
			setAutoRefresh(false);
			expect(useUIStore.getState().autoRefresh).toBe(false);
			setAutoRefresh(true); // reset
		});
	});
});
