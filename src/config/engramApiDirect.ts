import axios from "axios";

// Direct axios instance - use only for non-Engram API calls
// For Engram API calls, use engramRequest from axios.ts
export const engramApi = axios.create({
	baseURL: "http://127.0.0.1:7437",
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
	},
});
