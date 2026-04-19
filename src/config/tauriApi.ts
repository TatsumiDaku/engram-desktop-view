// Wrapper for Engram API calls via Tauri Rust backend
// This avoids CORS by routing requests through the Rust side
import { invoke } from "@tauri-apps/api/core";
import { useLogStore } from "@/stores/logStore";

export interface EngramApiResponse<T = unknown> {
	data: T | null;
	error: string | null;
}

export async function engramApiCall<T = unknown>(
	method: string,
	path: string,
	body?: object,
): Promise<T> {
	const requestBody = body ? JSON.stringify(body) : null;
	const startTime = Date.now();

	useLogStore.getState().addLog({
		level: "request",
		method,
		url: path,
		message: `Tauri invoke: ${method} ${path}`,
	});

	try {
		const response = await invoke<string>("engram_request", {
			method,
			path,
			body: requestBody,
		});

		const duration = Date.now() - startTime;
		const dataPreview = response ? response.slice(0, 100) : undefined;

		useLogStore.getState().addLog({
			level: "response",
			method,
			url: path,
			status: 200,
			duration,
			message: "Response received",
			dataPreview,
		});

		if (!response || response.trim() === "") {
			return null as T;
		}

		return JSON.parse(response) as T;
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
