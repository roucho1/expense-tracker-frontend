import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";

export function exportToCSV(
  transactions: Transaction[],
  categories: Category[],
) {
  // 1. 定義欄位標題
  const headers = ["日期", "類型", "分類", "備註", "金額"];

  // 2. 把資料轉成陣列
  const rows = transactions.map((t) => [
    t.date,
    t.type === "income" ? "收入" : "支出",
    categories.find((c) => c.id === t.category_id)?.name ?? "未分類",
    `"${t.note}"`, // 避免備註逗號被拆開
    t.amount,
  ]);

  // 3. 組合成 CSV 字串
  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

  // 4. 建立下載連結
  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "記帳紀錄.csv";
  link.click();
  URL.revokeObjectURL(url);
}
