// 首頁 總覽

"use client";

import SummaryCards from "./SummaryCards";
import ExpenseChart from "./ExpenseChart";
import { Stats, Period, periods } from "../HomeContainer";
import { Dispatch, SetStateAction } from "react";
import { Transaction } from "@/types/transaction";
import { Category } from "@/types/category";

interface Props {
  period: Period;
  setPeriod: Dispatch<SetStateAction<Period>>;
  stats: Stats;
  filteredForChart: Transaction[];
  categories: Category[];
}

export default function OverviewSection({
  period,
  setPeriod,
  stats,
  filteredForChart,
  categories,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">總覽</h2>
        <div className="flex border rounded overflow-hidden text-sm">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1 ${period === p ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      {/* 統計卡片 */}
      <SummaryCards stats={stats}></SummaryCards>
      {/* 支出占比/圓餅圖表 */}
      <ExpenseChart
        filteredForChart={filteredForChart}
        categories={categories}
      ></ExpenseChart>
    </div>
  );
}
