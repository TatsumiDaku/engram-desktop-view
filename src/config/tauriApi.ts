// Wrapper for Engram API calls via Tauri Rust backend
// This avoids CORS by routing requests through the Rust side
import { invoke } from "@tauri-apps/api/core";

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

	try {
		const response = await invoke<string>("engram_request", {
			method,
			path,
			body: requestBody,
		});

		if (!response || response.trim() === "") {
			return null as T;
		}

		return JSON.parse(response) as T;
	} catch (error) {
		console.error(`[engramApiCall] ${method} ${path} failed:`, error);
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
