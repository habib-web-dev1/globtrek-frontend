import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  // Guard against SSR — localStorage only exists in the browser
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("trek_token");
    if (token) config.headers.Authorization = token;
  }
  return config;
});

export default api;
