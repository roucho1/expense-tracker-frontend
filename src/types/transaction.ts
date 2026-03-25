export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  type: TransactionType;
  category_id: number | null;
  note: string;
  amount: number;
  date: string;
  created_at: string;
}

export interface TransactionForm {
  type: TransactionType;
  category_id: number | null;
  note: string;
  amount: string;
  date: string;
}
