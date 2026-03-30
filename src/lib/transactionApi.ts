import { Transaction, TransactionForm } from "@/types/transaction";
import api from "./api";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/transactions`;

export const transactionApi = {
  getAll: (params?: { startDate?: string; endDate?: string }) =>
    api.get<Transaction[]>(BASE, {
      params: {
        start_date: params?.startDate,
        end_date: params?.endDate,
      },
    }),
  create: (data: TransactionForm) =>
    api.post<Transaction>(BASE, { ...data, amount: Number(data.amount) }),
  update: (id: number, data: TransactionForm) =>
    api.put<Transaction>(`${BASE}/${id}`, {
      ...data,
      amount: Number(data.amount),
    }),
  delete: (id: number) => api.delete(`${BASE}/${id}`),
};
