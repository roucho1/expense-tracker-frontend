import api from "./api";
import { LoginResponse, userResponse } from "@/types/auth";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/auth`;

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>(`${BASE}/login`, { email, password }),
  register: (email: string, password: string) =>
    api.post(`${BASE}/register`, { email, password }),
  getMe: () => api.get<userResponse>(`${BASE}/me`),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.put<{ message: string }>(`${BASE}/change-password`, {
      old_password: oldPassword,
      new_password: newPassword,
    }),
};
