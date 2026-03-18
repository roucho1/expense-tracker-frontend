"use client";

import { useState } from "react";

type TransactionType = "income" | "expense";

interface Transaction {
  id: number;
  type: TransactionType;
  category: string;
  note: string;
  amount: number;
  date: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 1,
    type: "expense",
    category: "餐飲",
    note: "午餐",
    amount: 120,
    date: "2026-03-18",
  },
  {
    id: 2,
    type: "income",
    category: "薪資",
    note: "三月薪水",
    amount: 15000,
    date: "2026-03-17",
  },
  {
    id: 3,
    type: "expense",
    category: "交通",
    note: "捷運",
    amount: 30,
    date: "2026-03-17",
  },
  {
    id: 4,
    type: "expense",
    category: "娛樂",
    note: "電影",
    amount: 280,
    date: "2026-03-16",
  },
  {
    id: 5,
    type: "expense",
    category: "餐飲",
    note: "晚餐",
    amount: 95,
    date: "2026-03-16",
  },
];

const categories = ["全部", "餐飲", "交通", "娛樂", "薪資", "其他"];

export default function TransactionsPage() {
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("全部");

  const filtered = mockTransactions.filter((t) => {
    const matchType = filter === "all" || t.type === filter;
    const matchCategory =
      categoryFilter === "全部" || t.category === categoryFilter;
    return matchType && matchCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* 標題 + 新增按鈕 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">記帳紀錄</h1>
        <button className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded">
          + 新增
        </button>
      </div>

      {/* 篩選：收支類型 */}
      <div className="flex border rounded overflow-hidden text-sm w-fit">
        {(["all", "income", "expense"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 ${filter === f ? "bg-primary text-primary-foreground" : ""}`}
          >
            {f === "all" ? "全部" : f === "income" ? "收入" : "支出"}
          </button>
        ))}
      </div>

      {/* 篩選：分類 */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`text-sm px-3 py-1 rounded-full border ${
              categoryFilter === c ? "bg-primary text-primary-foreground" : ""
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 列表 */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-sm">
            沒有符合條件的紀錄
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className="border rounded-lg px-4 py-3 flex items-center justify-between"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{t.note}</span>
                <span className="text-xs text-muted-foreground">
                  {t.category}・{t.date}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {t.amount.toLocaleString()}
                </span>
                <button className="text-xs text-muted-foreground hover:text-foreground">
                  編輯
                </button>
                <button className="text-xs text-red-400 hover:text-red-600">
                  刪除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
