import { describe, it, expect, vi, beforeEach } from "vitest";
import { engramGet, engramPost } from "@/config/electronApi";

// Get the mock function
const mockEngramRequest = window.electronAPI.engramRequest as ReturnType<typeof vi.fn>;

describe("electronApi", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("engramGet", () => {
		it("should call engramRequest with GET method", async () => {
			mockEngramRequest.mockResolvedValueOnce([]);

			await engramGet("/test");

			expect(mockEngramRequest).toHaveBeenCalledWith("GET", "/test", undefined);
		});

		it("should return parsed JSON response", async () => {
			const mockData = { id: 1, name: "test" };
			mockEngramRequest.mockResolvedValueOnce(mockData);

			const result = await engramGet<typeof mockData>("/test");

			expect(result).toEqual(mockData);
		});

		it("should throw on error", async () => {
			mockEngramRequest.mockRejectedValueOnce(new Error("Network error"));

			await expect(engramGet("/test")).rejects.toThrow("Network error");
		});
	});

	describe("engramPost", () => {
		it("should call engramRequest with POST method and body", async () => {
			mockEngramRequest.mockResolvedValueOnce({ success: true });

			await engramPost("/test", { data: "value" });

			expect(mockEngramRequest).toHaveBeenCalledWith("POST", "/test", { data: "value" });
		});
	});
});
