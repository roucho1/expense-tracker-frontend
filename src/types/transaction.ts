import dayjs from "dayjs";

export type TransactionType = "income" | "expense";

//記帳資料欄位
export interface Transaction {
  id: number;
  type: TransactionType; // "支出 | 收入"
  category_id: number | null; // 分類id
  note: string; // 記帳備註
  amount: number; // 金額
  date: string; // 支出/收入日期
  created_at: string; // 資料建立日期
}

//記帳表單
export interface TransactionForm {
  type: TransactionType; // "支出 | 收入"
  category_id: number | null; // 分類id
  note: string; // 記帳備註
  amount: string; // 金額
  date: string; // 支出/收入日期
}

// 初始化表單內容
export function createEmptyForm(
  type: TransactionType = "expense",
): TransactionForm {
  return {
    type,
    category_id: null,
    note: "",
    amount: "",
    date: dayjs().format("YYYY-MM-DD"),
  };
}

export function sortByDate(data: Transaction[]): Transaction[] {
  return [...data].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
