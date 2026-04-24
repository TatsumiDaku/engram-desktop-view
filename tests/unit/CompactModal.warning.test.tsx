import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, fireEvent, cleanup } from "@testing-library/react";
import { CompactModal } from "@/components/organisms/CompactModal";
import { useUIStore } from "@/stores/uiStore";

// Mock functions at module level
const mockUseCompactSessionsMutateAsync = vi.fn();
const mockUseCompactProjectsMutateAsync = vi.fn();

// Setup default mock implementations
const setupMocks = () => {
	mockUseCompactSessionsMutateAsync.mockResolvedValue({
		observationsPreserved: 5,
		sessionsDeleted: 1,
		newSessionId: "new-session",
	});
	mockUseCompactProjectsMutateAsync.mockResolvedValue({
		projectsMigrated: 2,
	});
};

// Mock useEngram with all re-exported hooks
vi.mock("@/hooks/useEngram", () => {
	const useSessions = vi.fn();
	const useCompactSessions = vi.fn();
	const useCompactProjects = vi.fn();

	return {
		useSessions,
		useCompactSessions,
		useCompactProjects,
	};
});

// Mock i18next with proper interpolation
vi.mock("react-i18next", () => ({
	useTranslation: () => ({
		t: (key: string, params?: Record<string, unknown>) => {
			const translations: Record<string, string> = {
				"compact.title": "Compact",
				"compact.tabs.sessions": "Sessions",
				"compact.tabs.projects": "Projects",
				"compact.sessions.selectSessions": "Select sessions to compact",
				"compact.sessions.selectedCount": "{{count}} sessions selected",
				"compact.sessions.observationCount": "{{count}} observations will be preserved",
				"compact.sessions.newSessionName": "New session name",
				"compact.sessions.namePlaceholder": "Enter session name",
				"compact.sessions.warning": "This will recreate observations with new session IDs. Original timestamps will be lost.",
				"compact.sessions.button": "Compact {{count}} sessions",
				"compact.projects.selectProjects": "Select projects to compact",
				"compact.projects.selectedCount": "{{count}} projects selected",
				"compact.projects.targetProject": "Target project",
				"compact.projects.targetPlaceholder": "Enter target project name",
				"compact.projects.button": "Compact Projects",
				"compact.projects.sessionCount": "{{count}} sessions",
				"compact.success.title": "Compactación exitosa",
				"compact.success.sessions": "{{count}} sesiones → 1 sesión",
				"compact.success.observations": "{{count}} observaciones preservadas",
				"compact.success.deleted": "{{count}} sesiones eliminadas",
				"compact.success.projects": "{{count}} proyectos migrados",
				"sessions.empty.title": "No sessions found",
				"projects.empty.title": "No projects found",
				"observationDetailModal.close": "Close",
			};
			let text = translations[key] || key;
			if (params) {
				Object.entries(params).forEach(([k, v]) => {
					text = text.replace(`{{${k}}}`, String(v));
				});
			}
			return text;
		},
	}),
}));

// Import mocked modules
import { useSessions, useCompactSessions, useCompactProjects } from "@/hooks/useEngram";

// Create a test query client
const createTestQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false },
			mutations: { retry: false },
		},
	});

// Wrapper for render with QueryClientProvider
const wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
);

// Reset store state before each test
const resetStore = () => {
	useUIStore.setState({ compactModalOpen: false });
};

describe("CompactModal - Destructive Warning Display", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetStore();
		setupMocks();

		// Setup default mock implementations
		useSessions.mockReturnValue({
			data: {
				sessions: [
					{ id: "session-1", project: "project-a", observationCount: 5, agentName: "agent-1" },
					{ id: "session-2", project: "project-a", observationCount: 3, agentName: "agent-2" },
				],
			},
			isLoading: false,
		});

		useCompactSessions.mockReturnValue({
			mutateAsync: mockUseCompactSessionsMutateAsync,
			isPending: false,
		});

		useCompactProjects.mockReturnValue({
			mutateAsync: mockUseCompactProjectsMutateAsync,
			isPending: false,
		});

		useUIStore.getState().setCompactModalOpen(true);
	});

	afterEach(() => {
		cleanup();
		resetStore();
	});

	const renderModal = () => {
		return render(<CompactModal />, { wrapper });
	};

	describe("Sessions tab warning", () => {
		it("should display destructive warning on sessions tab", () => {
			renderModal();

			// Find the warning div by its class
			const warningDiv = document.querySelector('div.text-destructive');
			expect(warningDiv).toBeTruthy();
			expect(warningDiv?.textContent).toContain("This will recreate observations");
		});

		it("should display warning above action buttons", () => {
			renderModal();

			// Find the warning and buttons
			const warningDiv = document.querySelector('div.text-destructive');
			const buttonsDiv = document.querySelector('div.justify-end');

			// Warning div should come before buttons div
			if (warningDiv && buttonsDiv) {
				const body = document.body;
				const warningIndex = Array.from(body.querySelectorAll('div')).indexOf(warningDiv);
				const buttonsIndex = Array.from(body.querySelectorAll('div')).indexOf(buttonsDiv);
				expect(warningIndex).toBeLessThan(buttonsIndex);
			}
		});

		it("should show warning in distinct styling", () => {
			renderModal();

			// Warning should have destructive styling (bg-destructive/10)
			const warningDiv = document.querySelector('[class*="bg-destructive"]');
			expect(warningDiv).toBeTruthy();
		});

		it("should display warning icon", () => {
			renderModal();

			// Warning should have ⚠️ icon
			const warningDiv = document.querySelector('div.text-destructive');
			expect(warningDiv?.textContent?.startsWith("⚠️")).toBe(true);
		});

		it("should display warning regardless of selection state", () => {
			renderModal();

			// Warning visible even before selecting anything
			const warningDiv = document.querySelector('div.text-destructive');
			expect(warningDiv).toBeTruthy();
		});

		it("should display warning when sessions are selected", async () => {
			renderModal();

			// Select a session
			const checkboxes = document.querySelectorAll('input[type="checkbox"]');
			fireEvent.click(checkboxes[0]);

			await waitFor(() => {
				// Warning should still be visible
				const warningDiv = document.querySelector('div.text-destructive');
				expect(warningDiv).toBeTruthy();
			});
		});
	});

	describe("Projects tab warning absence", () => {
		it("should NOT display destructive warning on projects tab", async () => {
			renderModal();

			// Switch to projects tab
			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			await waitFor(() => {
				// Warning should not be present for projects
				const warningDiv = document.querySelector('div.bg-destructive');
				expect(warningDiv).toBeNull();
			});
		});

		it("should show projects tab without destructive messaging", async () => {
			renderModal();

			// Switch to projects tab
			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			await waitFor(() => {
				// Should show projects content without warning
				expect(screen.getByText("Select projects to compact")).toBeTruthy();
				// No destructive warning
				const warningDiv = document.querySelector('div.bg-destructive');
				expect(warningDiv).toBeNull();
			});
		});
	});

	describe("warning content accuracy", () => {
		it("should display warning text about recreating observations", () => {
			renderModal();

			const warningDiv = document.querySelector('div.text-destructive');
			expect(warningDiv?.textContent).toContain("recreate observations");
		});

		it("should mention timestamp loss", () => {
			renderModal();

			const warningDiv = document.querySelector('div.text-destructive');
			expect(warningDiv?.textContent).toContain("timestamps will be lost");
		});

		it("should mention recreation of observations", () => {
			renderModal();

			const warningDiv = document.querySelector('div.text-destructive');
			expect(warningDiv?.textContent).toContain("recreate observations");
		});
	});

	describe("warning visibility conditions", () => {
		it("should always show warning on sessions tab", () => {
			renderModal();
			const warningDiv = document.querySelector('[class*="bg-destructive"]');
			expect(warningDiv).toBeTruthy();
		});

		it("should hide warning on projects tab", async () => {
			renderModal();

			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			await waitFor(() => {
				const warningDiv = document.querySelector('div.bg-destructive');
				expect(warningDiv).toBeNull();
			});
		});

		it("should show warning again when switching back to sessions", async () => {
			renderModal();

			// Switch to projects
			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			// Switch back to sessions
			await waitFor(() => {
				const sessionsTab = screen.getByRole("button", { name: /Sessions/i });
				fireEvent.click(sessionsTab);
			});

			// Warning should reappear
			const warningDiv = document.querySelector('[class*="bg-destructive"]');
			expect(warningDiv).toBeTruthy();
		});
	});
});
