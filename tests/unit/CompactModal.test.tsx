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
vi.mock("@/hooks/useEngram", () => ({
	useSessions: vi.fn().mockImplementation(() => ({
		data: {
			sessions: [
				{ id: "session-1", project: "project-a", observationCount: 5, agentName: "agent-1" },
				{ id: "session-2", project: "project-a", observationCount: 3, agentName: "agent-2" },
				{ id: "session-3", project: "project-b", observationCount: 2, agentName: "agent-3" },
			],
		},
		isLoading: false,
	})),
	useCompactSessions: vi.fn().mockImplementation(() => ({
		mutateAsync: mockUseCompactSessionsMutateAsync,
		isPending: false,
	})),
	useCompactProjects: vi.fn().mockImplementation(() => ({
		mutateAsync: mockUseCompactProjectsMutateAsync,
		isPending: false,
	})),
}));

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

describe("CompactModal", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		resetStore();
		setupMocks();

		// Setup default mock implementations
		vi.mocked(useSessions).mockImplementation(() =>
			({
				data: {
					sessions: [
						{ id: "session-1", project: "project-a", observationCount: 5, agentName: "agent-1", type: "session", latestTitle: null, topicKey: null, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
						{ id: "session-2", project: "project-a", observationCount: 3, agentName: "agent-2", type: "session", latestTitle: null, topicKey: null, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
						{ id: "session-3", project: "project-b", observationCount: 2, agentName: "agent-3", type: "session", latestTitle: null, topicKey: null, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
					],
					stats: { projectCount: 2, sessionCount: 3, observationCount: 10, promptCount: 0, emptySessionCount: 0 },
				},
				isLoading: false,
			}) as any
		);

		vi.mocked(useCompactSessions).mockImplementation(() =>
			({
				mutateAsync: mockUseCompactSessionsMutateAsync,
				isPending: false,
			}) as any
		);

		vi.mocked(useCompactProjects).mockImplementation(() =>
			({
				mutateAsync: mockUseCompactProjectsMutateAsync,
				isPending: false,
			}) as any
		);

		// Open the modal for each test
		useUIStore.getState().setCompactModalOpen(true);
	});

	afterEach(() => {
		cleanup();
		resetStore();
	});

	const renderModal = () => {
		return render(<CompactModal />, { wrapper });
	};

	describe("tab rendering", () => {
		it("should render Sessions tab by default", () => {
			renderModal();

			// The Sessions tab button (with specific styling for active tab)
			const sessionsTab = document.querySelector('button.border-b-2.border-primary.text-primary');
			expect(sessionsTab?.textContent).toBe("Sessions");
		});

		it("should render Projects tab when clicked", async () => {
			renderModal();

			const projectsTab = document.querySelector('button.text-muted-foreground');
			fireEvent.click(projectsTab!);

			await waitFor(() => {
				expect(screen.getByText("Select projects to compact")).toBeTruthy();
			});
		});

		it("should show sessions content by default", () => {
			renderModal();

			expect(screen.getByText("Select sessions to compact")).toBeTruthy();
		});

		it("should switch between tabs correctly", async () => {
			renderModal();

			// Default: Sessions tab
			expect(screen.getByText("Select sessions to compact")).toBeTruthy();

			// Click Projects tab
			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			await waitFor(() => {
				expect(screen.getByText("Select projects to compact")).toBeTruthy();
			});

			// Click back to Sessions tab
			const sessionsTab = screen.getByRole("button", { name: /Sessions/i });
			fireEvent.click(sessionsTab);

			await waitFor(() => {
				expect(screen.getByText("Select sessions to compact")).toBeTruthy();
			});
		});
	});

	describe("checkbox selection - Sessions", () => {
		it("should render checkboxes for sessions", () => {
			renderModal();

			// Sessions should have checkboxes
			const checkboxes = document.querySelectorAll('input[type="checkbox"]');
			expect(checkboxes.length).toBeGreaterThan(0);
		});

		it("should toggle session selection on checkbox click", async () => {
			renderModal();

			const firstCheckbox = document.querySelectorAll('input[type="checkbox"]')[0];
			fireEvent.click(firstCheckbox);

			// Preview should show
			await waitFor(() => {
				expect(screen.getByText("1 sessions selected")).toBeTruthy();
			});
		});

		it("should show observation count in preview", async () => {
			renderModal();

			// Select first session (5 observations)
			const checkboxes = document.querySelectorAll('input[type="checkbox"]');
			fireEvent.click(checkboxes[0]);

			await waitFor(() => {
				expect(screen.getByText("5 observations will be preserved")).toBeTruthy();
			});
		});

		it("should handle multiple session selection", async () => {
			renderModal();

			const checkboxes = document.querySelectorAll('input[type="checkbox"]');
			fireEvent.click(checkboxes[0]);
			fireEvent.click(checkboxes[1]);

			await waitFor(() => {
				expect(screen.getByText("2 sessions selected")).toBeTruthy();
			});
		});
	});

	describe("checkbox selection - Projects", () => {
		it("should render checkboxes for projects", async () => {
			renderModal();

			// Switch to projects tab
			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			await waitFor(() => {
				const checkboxes = document.querySelectorAll('input[type="checkbox"]');
				expect(checkboxes.length).toBeGreaterThan(0);
			});
		});

		it("should toggle project selection", async () => {
			renderModal();

			// Switch to projects tab
			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			await waitFor(() => {
				const checkboxes = document.querySelectorAll('input[type="checkbox"]');
				fireEvent.click(checkboxes[0]);
			});

			await waitFor(() => {
				expect(screen.getByText("1 projects selected")).toBeTruthy();
			});
		});
	});

	describe("session name input", () => {
		it("should have session name input field", () => {
			renderModal();

			const input = screen.getByPlaceholderText("Enter session name");
			expect(input).toBeTruthy();
		});

		it("should update session name on input change", async () => {
			renderModal();

			const input = screen.getByPlaceholderText("Enter session name") as HTMLInputElement;
			fireEvent.change(input, { target: { value: "My Compacted Session" } });

			expect(input.value).toBe("My Compacted Session");
		});
	});

	describe("button states", () => {
		it("should disable compact button when no sessions selected", () => {
			renderModal();

			const button = screen.getByRole("button", { name: /Compact.*sessions/i }) as HTMLButtonElement;
			expect(button.disabled).toBe(true);
		});

		it("should disable compact button when session name is empty", async () => {
			renderModal();

			// Select a session
			const checkboxes = document.querySelectorAll('input[type="checkbox"]');
			fireEvent.click(checkboxes[0]);

			await waitFor(() => {
				const button = screen.getByRole("button", { name: /Compact.*sessions/i }) as HTMLButtonElement;
				expect(button.disabled).toBe(true);
			});
		});

		it("should enable compact button when session selected and name entered", async () => {
			renderModal();

			// Select a session
			const checkboxes = document.querySelectorAll('input[type="checkbox"]');
			fireEvent.click(checkboxes[0]);

			// Enter session name
			const input = screen.getByPlaceholderText("Enter session name");
			fireEvent.change(input, { target: { value: "My Session" } });

			await waitFor(() => {
				const button = screen.getByRole("button", { name: /Compact.*sessions/i }) as HTMLButtonElement;
				expect(button.disabled).toBe(false);
			});
		});
	});

	describe("projects tab button states", () => {
		it("should disable compact projects button when no projects selected", async () => {
			renderModal();

			// Switch to projects tab
			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			await waitFor(() => {
				const button = screen.getByRole("button", { name: /Compact Projects/i }) as HTMLButtonElement;
				expect(button.disabled).toBe(true);
			});
		});

		it("should disable compact projects button when target name empty", async () => {
			renderModal();

			// Switch to projects tab
			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			// Select a project
			await waitFor(() => {
				const checkboxes = document.querySelectorAll('input[type="checkbox"]');
				fireEvent.click(checkboxes[0]);
			});

			const button = screen.getByRole("button", { name: /Compact Projects/i }) as HTMLButtonElement;
			expect(button.disabled).toBe(true);
		});

		it("should enable compact projects button when project selected and target entered", async () => {
			renderModal();

			// Switch to projects tab
			const projectsTab = screen.getByRole("button", { name: /Projects/i });
			fireEvent.click(projectsTab);

			// Select a project
			await waitFor(() => {
				const checkboxes = document.querySelectorAll('input[type="checkbox"]');
				fireEvent.click(checkboxes[0]);
			});

			// Enter target project name
			const targetInput = screen.getByPlaceholderText("Enter target project name");
			fireEvent.change(targetInput, { target: { value: "Target Project" } });

			await waitFor(() => {
				const button = screen.getByRole("button", { name: /Compact Projects/i }) as HTMLButtonElement;
				expect(button.disabled).toBe(false);
			});
		});
	});

	describe("empty states", () => {
		it("should show empty message when no sessions", () => {
			vi.mocked(useSessions).mockReturnValueOnce({
				data: { sessions: [], stats: { projectCount: 0, sessionCount: 0, observationCount: 0, promptCount: 0, emptySessionCount: 0 } },
				isLoading: false,
			} as any);

			renderModal();

			expect(screen.getByText("No sessions found")).toBeTruthy();
		});
	});

	describe("close functionality", () => {
		it("should have cancel button", () => {
			renderModal();

			const cancelButton = screen.getByRole("button", { name: /Cancel/i });
			expect(cancelButton).toBeTruthy();
		});
	});

	describe("session grouping", () => {
		it("should group sessions by project", () => {
			renderModal();

			// Should see project labels
			expect(screen.getByText("project-a")).toBeTruthy();
			expect(screen.getByText("project-b")).toBeTruthy();
		});
	});
});
