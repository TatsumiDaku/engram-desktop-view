import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { useCompactSessions } from "@/hooks/useCompactSessions";
import * as engramService from "@/services/engramService";

// Mock the engramService module
vi.mock("@/services/engramService", async () => {
	const actual = await vi.importActual("@/services/engramService");
	return {
		...actual,
		createSession: vi.fn(),
		createObservation: vi.fn(),
		deleteObservationHard: vi.fn(),
		deleteSession: vi.fn(),
		getAllObservations: vi.fn(),
	};
});

const mockCreateSession = vi.mocked(engramService.createSession);
const mockCreateObservation = vi.mocked(engramService.createObservation);
const mockDeleteObservationHard = vi.mocked(engramService.deleteObservationHard);
const mockDeleteSession = vi.mocked(engramService.deleteSession);
const mockGetAllObservations = vi.mocked(engramService.getAllObservations);

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

describe("useCompactSessions", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("successful session compaction", () => {
		it("should create new session", async () => {
			const { result } = renderHook(() => useCompactSessions(), { wrapper });

			mockCreateSession.mockResolvedValueOnce({ id: "new-session-id" });
			mockGetAllObservations.mockResolvedValueOnce([]);
			mockDeleteSession.mockResolvedValue(undefined);

			result.current.mutate({
				selectedSessionIds: ["session-1"],
				newSessionName: "Compacted Session",
			});

			await waitFor(() => {
				expect(mockCreateSession).toHaveBeenCalledWith("Compacted Session");
			});
		});

		it("should recreate each observation with new session_id", async () => {
			const { result } = renderHook(() => useCompactSessions(), { wrapper });

			const mockObservations = [
				{
					id: 1,
					sessionId: "session-1",
					project: "test-project",
					type: "bugfix" as const,
					title: "Test 1",
					content: "Content 1",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-01",
					updatedAt: "2024-01-01",
				},
				{
					id: 2,
					sessionId: "session-1",
					project: "test-project",
					type: "decision" as const,
					title: "Test 2",
					content: "Content 2",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-02",
					updatedAt: "2024-01-02",
				},
			];

			mockCreateSession.mockResolvedValueOnce({ id: "new-session-id" });
			mockGetAllObservations.mockResolvedValueOnce(mockObservations);
			mockCreateObservation
				.mockResolvedValueOnce({ ...mockObservations[0], id: 100 })
				.mockResolvedValueOnce({ ...mockObservations[1], id: 101 });
			mockDeleteObservationHard.mockResolvedValue(undefined);
			mockDeleteSession.mockResolvedValue(undefined);

			result.current.mutate({
				selectedSessionIds: ["session-1"],
				newSessionName: "Compacted Session",
			});

			await waitFor(() => {
				expect(mockCreateObservation).toHaveBeenCalledTimes(2);
			});

			// First observation
			expect(mockCreateObservation).toHaveBeenNthCalledWith(1, {
				sessionId: "new-session-id",
				project: "test-project",
				type: "bugfix",
				title: "Test 1",
				content: "Content 1",
				scope: "project",
				topicKey: null,
			});

			// Second observation
			expect(mockCreateObservation).toHaveBeenNthCalledWith(2, {
				sessionId: "new-session-id",
				project: "test-project",
				type: "decision",
				title: "Test 2",
				content: "Content 2",
				scope: "project",
				topicKey: null,
			});
		});

		it("should hard delete original observations", async () => {
			const { result } = renderHook(() => useCompactSessions(), { wrapper });

			const mockObservations = [
				{
					id: 1,
					sessionId: "session-1",
					project: "test-project",
					type: "bugfix" as const,
					title: "Test 1",
					content: "Content 1",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-01",
					updatedAt: "2024-01-01",
				},
			];

			mockCreateSession.mockResolvedValueOnce({ id: "new-session-id" });
			mockGetAllObservations.mockResolvedValueOnce(mockObservations);
			mockCreateObservation.mockResolvedValueOnce({ ...mockObservations[0], id: 100 });
			mockDeleteObservationHard.mockResolvedValue(undefined);
			mockDeleteSession.mockResolvedValue(undefined);

			result.current.mutate({
				selectedSessionIds: ["session-1"],
				newSessionName: "Compacted Session",
			});

			await waitFor(() => {
				expect(mockDeleteObservationHard).toHaveBeenCalledWith(1);
			});
		});

		it("should delete empty source sessions", async () => {
			const { result } = renderHook(() => useCompactSessions(), { wrapper });

			const mockObservations = [
				{
					id: 1,
					sessionId: "session-1",
					project: "test-project",
					type: "bugfix" as const,
					title: "Test 1",
					content: "Content 1",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-01",
					updatedAt: "2024-01-01",
				},
			];

			mockCreateSession.mockResolvedValueOnce({ id: "new-session-id" });
			mockGetAllObservations.mockResolvedValueOnce(mockObservations);
			mockCreateObservation.mockResolvedValueOnce({ ...mockObservations[0], id: 100 });
			mockDeleteObservationHard.mockResolvedValue(undefined);
			mockDeleteSession.mockResolvedValue(undefined);

			result.current.mutate({
				selectedSessionIds: ["session-1"],
				newSessionName: "Compacted Session",
			});

			await waitFor(() => {
				expect(mockDeleteSession).toHaveBeenCalledWith("session-1");
			});
		});

		it("should return result with stats", async () => {
			const { result } = renderHook(() => useCompactSessions(), { wrapper });

			const mockObservations = [
				{
					id: 1,
					sessionId: "session-1",
					project: "test-project",
					type: "bugfix" as const,
					title: "Test 1",
					content: "Content 1",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-01",
					updatedAt: "2024-01-01",
				},
				{
					id: 2,
					sessionId: "session-1",
					project: "test-project",
					type: "decision" as const,
					title: "Test 2",
					content: "Content 2",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-02",
					updatedAt: "2024-01-02",
				},
			];

			mockCreateSession.mockResolvedValueOnce({ id: "new-session-id" });
			mockGetAllObservations.mockResolvedValueOnce(mockObservations);
			mockCreateObservation
				.mockResolvedValueOnce({ ...mockObservations[0], id: 100 })
				.mockResolvedValueOnce({ ...mockObservations[1], id: 101 });
			mockDeleteObservationHard.mockResolvedValue(undefined);
			mockDeleteSession.mockResolvedValue(undefined);

			let finalResult: any;
			result.current.mutate(
				{
					selectedSessionIds: ["session-1"],
					newSessionName: "Compacted Session",
				},
				{
					onSuccess: (data) => {
						finalResult = data;
					},
				},
			);

			await waitFor(() => {
				expect(finalResult).toEqual({
					newSessionId: "new-session-id",
					observationsPreserved: 2,
					sessionsDeleted: 1,
				});
			});
		});
	});

	describe("abortion on recreation failure", () => {
		it("should abort if recreation fails", async () => {
			const { result } = renderHook(() => useCompactSessions(), { wrapper });

			const mockObservations = [
				{
					id: 1,
					sessionId: "session-1",
					project: "test-project",
					type: "bugfix" as const,
					title: "Test 1",
					content: "Content 1",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-01",
					updatedAt: "2024-01-01",
				},
				{
					id: 2,
					sessionId: "session-1",
					project: "test-project",
					type: "decision" as const,
					title: "Test 2",
					content: "Content 2",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-02",
					updatedAt: "2024-01-02",
				},
			];

			mockCreateSession.mockResolvedValueOnce({ id: "new-session-id" });
			mockGetAllObservations.mockResolvedValueOnce(mockObservations);
			// First creation succeeds
			mockCreateObservation.mockResolvedValueOnce({ ...mockObservations[0], id: 100 });
			// Second creation fails - should abort
			mockCreateObservation.mockRejectedValueOnce(new Error("Failed to create"));
			// Delete should NOT be called after failure
			mockDeleteObservationHard.mockResolvedValue(undefined);
			mockDeleteSession.mockResolvedValue(undefined);

			let error: any;
			result.current.mutate(
				{
					selectedSessionIds: ["session-1"],
					newSessionName: "Compacted Session",
				},
				{
					onError: (err) => {
						error = err;
					},
				},
			);

			await waitFor(() => {
				expect(error).toBeDefined();
				expect(error.message).toContain("Failed to recreate observation");
			});

			// When recreation fails, the hook throws immediately without attempting delete
			// for that observation. However, observations already successfully recreated
			// before the failure point WILL have their originals deleted (per hook implementation).
			// The key is: NO delete is called for the observation that FAILED to recreate.
			expect(mockDeleteObservationHard).toHaveBeenCalledTimes(1);
			expect(mockDeleteObservationHard).toHaveBeenCalledWith(1);
		});

		it("should preserve source sessions when recreation fails", async () => {
			const { result } = renderHook(() => useCompactSessions(), { wrapper });

			const mockObservations = [
				{
					id: 1,
					sessionId: "session-1",
					project: "test-project",
					type: "bugfix" as const,
					title: "Test 1",
					content: "Content 1",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-01",
					updatedAt: "2024-01-01",
				},
			];

			mockCreateSession.mockResolvedValueOnce({ id: "new-session-id" });
			mockGetAllObservations.mockResolvedValueOnce(mockObservations);
			mockCreateObservation.mockRejectedValueOnce(new Error("Failed to create"));
			// Session delete should NOT be called
			mockDeleteSession.mockResolvedValue(undefined);

			let error: any;
			result.current.mutate(
				{
					selectedSessionIds: ["session-1"],
					newSessionName: "Compacted Session",
				},
				{
					onError: (err) => {
						error = err;
					},
				},
			);

			await waitFor(() => {
				expect(error).toBeDefined();
			});

			// Should not delete source session when recreation fails
			expect(mockDeleteSession).not.toHaveBeenCalled();
		});
	});

	describe("error handling for deletion failures", () => {
		it("should continue attempting deletions even if one fails", async () => {
			const { result } = renderHook(() => useCompactSessions(), { wrapper });

			const mockObservations = [
				{
					id: 1,
					sessionId: "session-1",
					project: "test-project",
					type: "bugfix" as const,
					title: "Test 1",
					content: "Content 1",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-01",
					updatedAt: "2024-01-01",
				},
				{
					id: 2,
					sessionId: "session-1",
					project: "test-project",
					type: "decision" as const,
					title: "Test 2",
					content: "Content 2",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-02",
					updatedAt: "2024-01-02",
				},
			];

			mockCreateSession.mockResolvedValueOnce({ id: "new-session-id" });
			mockGetAllObservations.mockResolvedValueOnce(mockObservations);
			mockCreateObservation
				.mockResolvedValueOnce({ ...mockObservations[0], id: 100 })
				.mockResolvedValueOnce({ ...mockObservations[1], id: 101 });
			// First delete fails, second succeeds
			mockDeleteObservationHard
				.mockRejectedValueOnce(new Error("Delete failed"))
				.mockResolvedValueOnce(undefined);
			mockDeleteSession.mockResolvedValue(undefined);

			result.current.mutate({
				selectedSessionIds: ["session-1"],
				newSessionName: "Compacted Session",
			});

			await waitFor(() => {
				// Both deletions should be attempted
				expect(mockDeleteObservationHard).toHaveBeenCalledTimes(2);
			});
		});
	});

	describe("multiple sessions compaction", () => {
		it("should handle multiple sessions", async () => {
			const { result } = renderHook(() => useCompactSessions(), { wrapper });

			const mockObservations = [
				{
					id: 1,
					sessionId: "session-1",
					project: "test-project",
					type: "bugfix" as const,
					title: "Test 1",
					content: "Content 1",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-01",
					updatedAt: "2024-01-01",
				},
				{
					id: 2,
					sessionId: "session-2",
					project: "test-project",
					type: "decision" as const,
					title: "Test 2",
					content: "Content 2",
					scope: "project" as const,
					topicKey: null,
					createdAt: "2024-01-02",
					updatedAt: "2024-01-02",
				},
			];

			mockCreateSession.mockResolvedValueOnce({ id: "new-session-id" });
			mockGetAllObservations.mockResolvedValueOnce(mockObservations);
			mockCreateObservation
				.mockResolvedValueOnce({ ...mockObservations[0], id: 100 })
				.mockResolvedValueOnce({ ...mockObservations[1], id: 101 });
			mockDeleteObservationHard.mockResolvedValue(undefined);
			mockDeleteSession
				.mockResolvedValueOnce(undefined)
				.mockResolvedValueOnce(undefined);

			result.current.mutate({
				selectedSessionIds: ["session-1", "session-2"],
				newSessionName: "Compacted Session",
			});

			await waitFor(() => {
				expect(mockDeleteSession).toHaveBeenCalledTimes(2);
				expect(mockDeleteSession).toHaveBeenCalledWith("session-1");
				expect(mockDeleteSession).toHaveBeenCalledWith("session-2");
			});
		});
	});
});