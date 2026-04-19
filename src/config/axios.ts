import axios from "axios";

export const engramApi = axios.create({
  baseURL: "http://127.0.0.1:7437",
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
