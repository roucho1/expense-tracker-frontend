"use client";

import Link from "next/link";
import { useState } from "react";

const periods = ["日", "週", "月"] as const;
type Period = (typeof periods)[number];

// 假資料，之後串 API 再換掉
const mockStats = {
  日: { income: 500, expense: 320, balance: 180 },
  週: { income: 3500, expense: 2100, balance: 1400 },
  月: { income: 15000, expense: 9800, balance: 5200 },
};

const mockTransactions = [
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

export default function HomePage() {
  const [period, setPeriod] = useState<Period>("月");
  const stats = mockStats[period];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* 統計卡片 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">總覽</h2>
          <div className="flex border rounded overflow-hidden text-sm">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 ${period === p ? "bg-primary text-primary-foreground" : ""}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">收入</span>
            <span className="text-xl font-bold text-green-500">
              +{stats.income.toLocaleString()}
            </span>
          </div>
          <div className="border rounded-lg p-4 flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">支出</span>
            <span className="text-xl font-bold text-red-500">
              -{stats.expense.toLocaleString()}
            </span>
          </div>
          <div className="border rounded-lg p-4 flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">結餘</span>
            <span className="text-xl font-bold">
              {stats.balance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 最近紀錄 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">最近紀錄</h2>
          <Link
            href="/transactions"
            className="text-sm text-muted-foreground underline"
          >
            查看全部
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          {mockTransactions.map((t) => (
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
              <span
                className={`font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}
              >
                {t.type === "income" ? "+" : "-"}
                {t.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 快速新增 */}
      <div className="flex gap-3">
        <button className="flex-1 border rounded-lg py-3 text-sm font-medium text-red-500 border-red-200 hover:bg-red-50">
          + 新增支出
        </button>
        <button className="flex-1 border rounded-lg py-3 text-sm font-medium text-green-500 border-green-200 hover:bg-green-50">
          + 新增收入
        </button>
      </div>
    </div>
  );
}
