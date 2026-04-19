import axios from "axios";

export const engramApi = axios.create({
  baseURL: "http://127.0.0.1:7437",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

engramApi.interceptors.request.use(req => {
  console.log('[AXIOS REQUEST]', req.method, req.url);
  return req;
});

engramApi.interceptors.response.use(
  res => {
    console.log('[AXIOS RESPONSE]', res.status, res.config.url);
    return res;
  },
  err => {
    console.log('[AXIOS ERROR]', err.message, err.config?.url);
    return Promise.reject(err);
  }
);

// Health check helper
export const checkHealth = async (): Promise<boolean> => {
  try {
    await engramApi.get("/health");
    return true;
  } catch {
    return false;
  }
};
