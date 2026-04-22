// Electron API wrapper for Engram backend calls
// This uses the contextBridge exposed API from preload.ts

import { useLogStore } from "@/stores/logStore";

// Update status types matching preload.ts
export interface UpdateStatus {
	status: "checking-for-update" | "update-available" | "update-not-available" | "download-progress" | "update-downloaded" | "error";
	version?: string;
	percent?: number;
	bytesPerSecond?: number;
	total?: number;
	transferred?: number;
	message?: string;
}

// Type for the exposed electron API
declare global {
	interface Window {
		electronAPI: {
			engramRequest: (method: string, path: string, body?: object) => Promise<unknown>;
			minimizeWindow: () => void;
			maximizeWindow: () => void;
			closeWindow: () => void;
			getAppVersion: () => Promise<string>;
			getPlatform: () => string;
			onOpenSettings: (callback: () => void) => () => void;
			// Auto-update API
			checkForUpdates: () => Promise<{ success: boolean; updateInfo?: unknown; message?: string }>;
			downloadUpdate: () => Promise<{ success: boolean; message?: string }>;
			quitAndInstall: () => void;
			onUpdateStatus: (callback: (status: UpdateStatus) => void) => () => void;
		};
	}
}

export interface EngramApiResponse<T = unknown> {
	data: T | null;
	error: string | null;
}

export async function engramApiCall<T = unknown>(
	method: string,
	path: string,
	body?: object,
): Promise<T> {
	const startTime = Date.now();

	useLogStore.getState().addLog({
		level: "request",
		method,
		url: path,
		message: `Electron IPC: ${method} ${path}`,
	});

	try {
		const response = await window.electronAPI.engramRequest(method, path, body);

		const duration = Date.now() - startTime;
		const dataPreview = typeof response === "string" ? response.slice(0, 100) : undefined;

		useLogStore.getState().addLog({
			level: "response",
			method,
			url: path,
			status: 200,
			duration,
			message: "Response received",
			dataPreview,
		});

		if (!response || (typeof response === "string" && response.trim() === "")) {
			return null as T;
		}

		// Handle string responses (error messages like "Method Not Allowed")
		if (typeof response === "string") {
			if (response.includes("Method Not Allowed") || response.includes("invalid")) {
				throw new Error(response);
			}
		}

		return response as T;
	} catch (error) {
		const duration = Date.now() - startTime;
		const errorMsg = error instanceof Error ? error.message : String(error);
		useLogStore.getState().addLog({
			level: "error",
			method,
			url: path,
			duration,
			message: `ERROR: ${errorMsg}`,
		});
		throw error;
	}
}

// Convenience methods
export const engramGet = <T = unknown>(path: string) =>
	engramApiCall<T>("GET", path);

export const engramPost = <T = unknown>(path: string, body?: object) =>
	engramApiCall<T>("POST", path, body);

export const engramPatch = <T = unknown>(path: string, body?: object) =>
	engramApiCall<T>("PATCH", path, body);

export const engramDelete = <T = unknown>(path: string) =>
	engramApiCall<T>("DELETE", path);
