// 首頁 收入/支出/結餘統計

"use client";

import { CircleDollarSign, ShoppingCart, Wallet } from "lucide-react";
import { Stats } from "../HomeContainer";

interface Props {
  stats: Stats;
}

export default function SummaryCards({ stats }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="border rounded-lg shadow-sm p-4 flex flex-col gap-1 bg-green-50 dark:bg-green-950/50">
        <div className="flex items-center gap-2">
          <CircleDollarSign size={18} className="text-green-500" />
          <span className="text-sm text-muted-foreground">收入</span>
        </div>
        <span className="text-lg sm:text-2xl font-bold text-green-500">
          +{stats.income.toLocaleString()}
        </span>
      </div>
      <div className="border rounded-lg shadow-sm p-4 flex flex-col gap-1 bg-red-50 dark:bg-red-950/40">
        <div className="flex items-center gap-2">
          <ShoppingCart size={18} className="text-red-500" />
          <span className="text-sm text-muted-foreground">支出</span>
        </div>
        <span className="text-lg sm:text-2xl font-bold text-red-500">
          -{stats.expense.toLocaleString()}
        </span>
      </div>
      <div
        className={`border rounded-lg shadow-sm p-4 flex flex-col gap-1 ${stats.balance >= 0 ? "bg-blue-50 dark:bg-blue-950/40" : "bg-red-50 dark:bg-red-950/40"}`}
      >
        <div className="flex items-center gap-2">
          <Wallet
            size={18}
            className={stats.balance >= 0 ? "text-blue-500" : "text-red-500"}
          />
          <span className="text-sm text-muted-foreground">結餘</span>
        </div>
        <span
          className={`text-lg sm:text-2xl font-bold ${stats.balance >= 0 ? "text-blue-500" : "text-red-500"}`}
        >
          {stats.balance.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
