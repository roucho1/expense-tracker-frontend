import { Transaction, TransactionForm } from "@/types/transaction";
import api from "./api";

const BASE = `${process.env.NEXT_PUBLIC_API_URL}/transactions`;

export const transactionApi = {
  getAll: () => api.get<Transaction[]>(BASE),
  create: (data: TransactionForm) =>
    api.post<Transaction>(BASE, { ...data, amount: Number(data.amount) }),
  update: (id: number, data: TransactionForm) =>
    api.put<Transaction>(`${BASE}/${id}`, {
      ...data,
      amount: Number(data.amount),
    }),
  delete: (id: number) => api.delete(`${BASE}/${id}`),
};
