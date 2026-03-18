export type TransactionType = "income" | "expense";

export interface Transaction {
  id: number;
  type: TransactionType;
  category: string;
  note: string;
  amount: number;
  date: string;
}

export interface TransactionForm {
  type: TransactionType;
  category: string;
  note: string;
  amount: string;
  date: string;
}
