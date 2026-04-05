import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 每次請求自動帶上 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname === "/login") return Promise.reject(error);
      localStorage.removeItem("token");
      toast.error("登入已過期，請重新登入", { duration: 3000 });
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
    }
    return Promise.reject(error);
  },
);

export default api;
