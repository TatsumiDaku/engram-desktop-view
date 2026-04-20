import { describe, it, expect, vi, beforeEach } from "vitest";
import {
	getSessions,
	getObservations,
	getHealth,
	getStats,
} from "@/services/engramService";

const mockEngramRequest = window.electronAPI.engramRequest as ReturnType<typeof vi.fn>;

describe("engramService", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("getSessions", () => {
		it("should return sessions from API", async () => {
			const mockSessions = [
				{
					id: "session-1",
					project: "test-project",
					started_at: "2024-01-01T00:00:00Z",
					observation_count: 5,
				},
			];
			mockEngramRequest.mockResolvedValueOnce(mockSessions);

			const result = await getSessions();

			expect(result.sessions).toHaveLength(1);
			expect(result.sessions[0].id).toBe("session-1");
			expect(result.sessions[0].project).toBe("test-project");
			expect(result.sessions[0].observationCount).toBe(5);
		});

		it("should handle manual sessions correctly", async () => {
			const mockSessions = [
				{
					id: "manual-save-test",
					project: "test",
					started_at: "2024-01-01T00:00:00Z",
					observation_count: 0,
				},
			];
			mockEngramRequest.mockResolvedValueOnce(mockSessions);

			const result = await getSessions();

			expect(result.sessions[0].agentName).toBe("manual");
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
