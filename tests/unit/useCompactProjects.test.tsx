import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useCompactProjects } from "@/hooks/useCompactProjects";
import * as engramService from "@/services/engramService";

// Mock the engramService module
vi.mock("@/services/engramService", async () => {
	const actual = await vi.importActual("@/services/engramService");
	return {
		...actual,
		mergeProjects: vi.fn(),
	};
});

const mockMergeProjects = vi.mocked(engramService.mergeProjects);

// Create a test query client
const createTestQueryClient = () => new QueryClient({
	defaultOptions: {
		queries: { retry: false },
		mutations: { retry: false },
	},
});

// Wrapper for renderHook with QueryClientProvider
const wrapper = ({ children }: { children: React.ReactNode }) => (
	<QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
);

describe("useCompactProjects", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("successful project compaction", () => {
		it("should call mergeProjects for each selected project", async () => {
			const { result } = renderHook(() => useCompactProjects(), { wrapper });

			mockMergeProjects
				.mockResolvedValueOnce({ merged: 5 })
				.mockResolvedValueOnce({ merged: 3 });

			result.current.mutate({
				selectedProjects: ["project-a", "project-b"],
				targetProject: "target-project",
			});

			await waitFor(() => {
				expect(mockMergeProjects).toHaveBeenCalledTimes(2);
			});

			expect(mockMergeProjects).toHaveBeenNthCalledWith(1, "project-a", "target-project");
			expect(mockMergeProjects).toHaveBeenNthCalledWith(2, "project-b", "target-project");
		});

		it("should return correct count of migrated projects", async () => {
			const { result } = renderHook(() => useCompactProjects(), { wrapper });

			mockMergeProjects
				.mockResolvedValueOnce({ merged: 5 })
				.mockResolvedValueOnce({ merged: 3 });

			let finalResult: any;
			result.current.mutate(
				{
					selectedProjects: ["project-a", "project-b"],
					targetProject: "target-project",
				},
				{
					onSuccess: (data) => {
						finalResult = data;
					},
				},
			);

			await waitFor(() => {
				expect(finalResult).toEqual({ projectsMigrated: 2 });
			});
		});

		it("should handle single project selection", async () => {
			const { result } = renderHook(() => useCompactProjects(), { wrapper });

			mockMergeProjects.mockResolvedValueOnce({ merged: 5 });

			result.current.mutate({
				selectedProjects: ["project-a"],
				targetProject: "target-project",
			});

			await waitFor(() => {
				expect(mockMergeProjects).toHaveBeenCalledTimes(1);
				expect(mockMergeProjects).toHaveBeenCalledWith("project-a", "target-project");
			});
		});
	});

	describe("error handling", () => {
		it("should continue with remaining projects if one fails", async () => {
			const { result } = renderHook(() => useCompactProjects(), { wrapper });

			mockMergeProjects
				.mockRejectedValueOnce(new Error("Migration failed"))
				.mockResolvedValueOnce({ merged: 3 })
				.mockResolvedValueOnce({ merged: 7 });

		 result.current.mutate({
				selectedProjects: ["project-a", "project-b", "project-c"],
				targetProject: "target-project",
			});

			await waitFor(() => {
				expect(mockMergeProjects).toHaveBeenCalledTimes(3);
			});
		});

		it("should report partial success count", async () => {
			const { result } = renderHook(() => useCompactProjects(), { wrapper });

			mockMergeProjects
				.mockRejectedValueOnce(new Error("Migration failed"))
				.mockResolvedValueOnce({ merged: 3 })
				.mockResolvedValueOnce({ merged: 7 });

			let finalResult: any;
			result.current.mutate(
				{
					selectedProjects: ["project-a", "project-b", "project-c"],
					targetProject: "target-project",
				},
				{
					onSuccess: (data) => {
						finalResult = data;
					},
				},
			);

			await waitFor(() => {
				// Only 2 succeeded (project-b and project-c)
				expect(finalResult).toEqual({ projectsMigrated: 2 });
			});
		});
	});

	describe("empty selection", () => {
		it("should handle empty selection without calling mergeProjects", async () => {
			const { result } = renderHook(() => useCompactProjects(), { wrapper });

			result.current.mutate({
				selectedProjects: [],
				targetProject: "target-project",
			});

			await waitFor(() => {
				expect(mockMergeProjects).not.toHaveBeenCalled();
			});
		});
	});

	describe("multiple projects", () => {
		it("should handle multiple projects in sequence", async () => {
			const { result } = renderHook(() => useCompactProjects(), { wrapper });

			mockMergeProjects
				.mockResolvedValueOnce({ merged: 1 })
				.mockResolvedValueOnce({ merged: 2 })
				.mockResolvedValueOnce({ merged: 3 })
				.mockResolvedValueOnce({ merged: 4 });

			result.current.mutate({
				selectedProjects: ["p1", "p2", "p3", "p4"],
				targetProject: "target",
			});

			await waitFor(() => {
				expect(mockMergeProjects).toHaveBeenCalledTimes(4);
			});
		});
	});
});