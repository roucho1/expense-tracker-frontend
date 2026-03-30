import { Category, CategoryForm } from "@/types/category";
import api from "./api";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

export const categoryApi = {
  getAll: () => api.get<Category[]>(BASE),
  create: (data: CategoryForm) => api.post<Category>(BASE, data),
  update: (id: number, data: CategoryForm) =>
    api.put<Category>(`${BASE}/${id}`, data),
  delete: (id: number) => api.delete(`${BASE}/${id}`),
};
