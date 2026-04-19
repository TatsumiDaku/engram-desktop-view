import { useLogStore } from "@/stores/logStore";
import { invoke } from "@tauri-apps/api/core";

export interface EngramResponse {
	success: boolean;
	data?: string;
	error?: string;
}

/**
 * Make HTTP request to Engram via Tauri backend to avoid CORS
 */
export async function engramRequest(
	method: "GET" | "POST" | "PATCH" | "DELETE",
	path: string,
	body?: object | null,
): Promise<string> {
	const bodyStr = body ? JSON.stringify(body) : null;

	useLogStore.getState().addLog({
		level: "request",
		method,
		url: path,
		message: `Tauri invoke: ${method} ${path}`,
	});

	try {
		const result = await invoke<string>("engram_request", {
			method,
			path,
			body: bodyStr,
		});

		const dataPreview = result ? result.slice(0, 100) : undefined;
		useLogStore.getState().addLog({
			level: "response",
			method,
			url: path,
			status: 200,
			message: "Response received",
			dataPreview,
		});

		return result;
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : String(error);
		useLogStore.getState().addLog({
			level: "error",
			method,
			url: path,
			message: `ERROR: ${errorMsg}`,
		});
		throw error;
	}
}


