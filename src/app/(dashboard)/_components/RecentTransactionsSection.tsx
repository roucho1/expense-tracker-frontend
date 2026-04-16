// 最近記帳紀錄

"use client";

import TransactionModal from "@/components/TransactionModal";
import { Category } from "@/types/category";
import {
  createEmptyForm,
  Transaction,
  TransactionForm,
  TransactionType,
} from "@/types/transaction";
import Link from "next/link";
import { useState } from "react";

interface Props {
  recentTransactions: Transaction[];
  categories: Category[];
  addTransaction: (data: TransactionForm) => void;
}

export default function RecentTransactionsSection({
  recentTransactions,
  categories,
  addTransaction,
}: Props) {
  const [quickAddType, setQuickAddType] = useState<TransactionType | null>(
    null,
  );

  return (
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
        {recentTransactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-base">
            📝 還沒有記帳紀錄，點擊下方新增第一筆吧！
          </div>
        ) : (
          recentTransactions.map((t) => (
            <div
              key={t.id}
              className="border rounded-lg shadow-sm px-4 py-3 flex items-center justify-between hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{t.note}</span>
                <span className="text-xs text-muted-foreground">
                  {categories.find((c) => c.id === t.category_id)?.name ??
                    "未分類"}
                  ・{t.date}
                </span>
              </div>
              <span
                className={`font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}
              >
                {t.type === "income" ? "+" : "-"}
                {t.amount.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>

      {/* 快速新增 */}
      <div className="flex gap-3 mt-8">
        <button
          onClick={() => setQuickAddType("expense")}
          className="flex-1 border rounded-lg shadow-sm py-3 text-sm font-medium text-red-500 border-red-200 hover:bg-red-50 dark:bg-red-950/20 dark:hover:bg-red-950/40"
        >
          + 新增支出
        </button>
        <button
          onClick={() => setQuickAddType("income")}
          className="flex-1 border rounded-lg shadow-sm py-3 text-sm font-medium text-green-500 border-green-200 hover:bg-green-50 dark:bg-green-950/20 dark:hover:bg-green-950/40"
        >
          + 新增收入
        </button>
      </div>
      <TransactionModal
        open={quickAddType !== null}
        onClose={() => setQuickAddType(null)}
        onSubmit={async (data) => {
          await addTransaction(data);
          setQuickAddType(null);
        }}
        initialData={createEmptyForm(quickAddType ?? "expense")}
        categories={categories}
      />
    </div>
  );
}
