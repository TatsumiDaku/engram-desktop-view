import axios from "axios";

export const engramApi = axios.create({
  baseURL: "/engram-api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Health check helper
export const checkHealth = async (): Promise<boolean> => {
  try {
    await engramApi.get("/health");
    return true;
  } catch {
    return false;
  }
};
