import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	getSessions,
	getHealth,
	getStats,
} from "@/services/engramService";

const mockEngramRequest = window.electronAPI.engramRequest as ReturnType<typeof vi.fn>;

describe("engramService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getSessions", () => {
		it("should return sessions from observations", async () => {
			const mockObservations = [
				{ id: 1, session_id: "session-1", project: "test-project", type: "bugfix", title: "Test", content: "Content", created_at: "2024-01-01", updated_at: "2024-01-01", scope: "project", topic_key: null },
				{ id: 2, session_id: "session-1", project: "test-project", type: "decision", title: "Test2", content: "Content2", created_at: "2024-01-02", updated_at: "2024-01-02", scope: "project", topic_key: null },
			];
			// getAllObservations calls /search multiple times - mock returns observations each time
			mockEngramRequest.mockImplementation(() => Promise.resolve([...mockObservations]));

			const result = await getSessions();

			expect(result.sessions).toHaveLength(1);
			expect(result.sessions[0].id).toBe("session-1");
			expect(result.sessions[0].project).toBe("test-project");
			expect(result.sessions[0].observationCount).toBe(2);
		});

		it("should handle manual sessions correctly", async () => {
			const mockObservations = [
				{ id: 1, session_id: "manual-save-test", project: "test", type: "bugfix", title: "Test", content: "Content", created_at: "2024-01-01", updated_at: "2024-01-01", scope: "project", topic_key: null },
			];
			mockEngramRequest.mockImplementation(() => Promise.resolve([...mockObservations]));

			const result = await getSessions();

			expect(result.sessions[0].agentName).toBe("manual");
		});

		it("should handle sessions with agent-name date pattern", async () => {
			const mockObservations = [
				{ id: 1, session_id: "agent-name-20240101-test", project: "test-project", type: "bugfix", title: "Test", content: "Content", created_at: "2024-01-01", updated_at: "2024-01-01", scope: "project", topic_key: null },
			];
			mockEngramRequest.mockImplementation(() => Promise.resolve([...mockObservations]));

			const result = await getSessions();

			expect(result.sessions[0].agentName).toBe("agent-name");
		});

		it("should skip observations without sessionId", async () => {
			const mockObservations = [
				{ id: 1, session_id: "session-1", project: "test-project", type: "bugfix", title: "Test", content: "Content", created_at: "2024-01-01", updated_at: "2024-01-01", scope: "project", topic_key: null },
				{ id: 2, session_id: null, project: "test-project", type: "decision", title: "No Session", content: "Content2", created_at: "2024-01-02", updated_at: "2024-01-02", scope: "project", topic_key: null },
			];
			mockEngramRequest.mockImplementation(() => Promise.resolve([...mockObservations]));

			const result = await getSessions();

			expect(result.sessions).toHaveLength(1);
			expect(result.sessions[0].observationCount).toBe(1);
		});
	});

	describe("getHealth", () => {
		it("should return health status", async () => {
			const mockHealth = {
				status: "online",
				version: "1.0.0",
				timestamp: "2024-01-01T00:00:00Z",
			};
			mockEngramRequest.mockResolvedValueOnce(mockHealth);

			const result = await getHealth();

			expect(result.status).toBe("online");
			expect(result.version).toBe("1.0.0");
		});
	});

	describe("getStats", () => {
		it("should return stats from API", async () => {
			const mockStats = {
				total_sessions: 10,
				total_observations: 100,
				total_prompts: 50,
				projects: ["project1", "project2"],
			};
			mockEngramRequest.mockResolvedValueOnce(mockStats);

			const result = await getStats();

			expect(result.sessionCount).toBe(10);
			expect(result.observationCount).toBe(100);
			expect(result.promptCount).toBe(50);
			expect(result.projectCount).toBe(2);
		});
	});
});
