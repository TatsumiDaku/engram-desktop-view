import { describe, it, expect, beforeEach } from "vitest";
import { useLogStore, type LogEntry } from "@/stores/logStore";

describe("logStore", () => {
	beforeEach(() => {
		// Reset store before each test
		useLogStore.setState({ logs: [], isVisible: false });
	});

	describe("addLog", () => {
		it("should add a log entry", () => {
			const { addLog } = useLogStore.getState();

			addLog({
				level: "request",
				method: "GET",
				url: "/test",
				message: "Test request",
			});

			const { logs } = useLogStore.getState();
			expect(logs).toHaveLength(1);
			expect(logs[0].level).toBe("request");
			expect(logs[0].method).toBe("GET");
		});

		it("should add multiple log entries", () => {
			const { addLog } = useLogStore.getState();

			addLog({ level: "request", message: "Request 1" });
			addLog({ level: "response", message: "Response 1" });
			addLog({ level: "error", message: "Error 1" });

			const { logs } = useLogStore.getState();
			expect(logs).toHaveLength(3);
		});

		it("should keep only last 100 logs", () => {
			const { addLog } = useLogStore.getState();

			// Add 105 logs
			for (let i = 0; i < 105; i++) {
				addLog({ level: "info", message: `Log ${i}` });
			}

			const { logs } = useLogStore.getState();
			expect(logs).toHaveLength(100);
		});

		it("should assign unique IDs and timestamps", () => {
			const { addLog } = useLogStore.getState();

			addLog({ level: "info", message: "Log 1" });
			addLog({ level: "info", message: "Log 2" });

			const { logs } = useLogStore.getState();
			expect(logs[0].id).toBeDefined();
			expect(logs[1].id).toBeDefined();
			expect(logs[0].id).not.toBe(logs[1].id);
			expect(logs[0].timestamp).toBeInstanceOf(Date);
		});
	});

	describe("clearLogs", () => {
		it("should clear all logs", () => {
			const { addLog, clearLogs } = useLogStore.getState();

			addLog({ level: "info", message: "Log 1" });
			addLog({ level: "info", message: "Log 2" });
			clearLogs();

			const { logs } = useLogStore.getState();
			expect(logs).toHaveLength(0);
		});
	});

	describe("visibility", () => {
		it("should default to not visible", () => {
			const state = useLogStore.getState();
			expect(state.isVisible).toBe(false);
		});

		it("should toggle visibility", () => {
			const { toggleVisibility } = useLogStore.getState();

			toggleVisibility();
			expect(useLogStore.getState().isVisible).toBe(true);

			toggleVisibility();
			expect(useLogStore.getState().isVisible).toBe(false);
		});

		it("should set visibility directly", () => {
			const { setVisibility } = useLogStore.getState();

			setVisibility(true);
			expect(useLogStore.getState().isVisible).toBe(true);

			setVisibility(false);
			expect(useLogStore.getState().isVisible).toBe(false);
		});
	});
});
