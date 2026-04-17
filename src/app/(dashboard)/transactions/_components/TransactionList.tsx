"use client";

import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import { Dispatch, SetStateAction } from "react";

interface Props {
  transactions: Transaction[];
  filtered: Transaction[];
  categories: Category[];
  setEditingTransaction: Dispatch<SetStateAction<Transaction | null>>;
  setDeletingId: Dispatch<SetStateAction<number | null>>;
}

export default function TransactionList({
  transactions,
  filtered,
  categories,
  setEditingTransaction,
  setDeletingId,
}: Props) {
  return (
    <>
      {/* 列表 */}
      <div className="flex flex-col gap-2">
        {transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-base">
            📝 還沒有記帳紀錄，點擊右上角新增第一筆吧！
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-base">
            🔍 沒有符合條件的紀錄
          </div>
        ) : (
          filtered.map((t) => (
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
              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {t.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => setEditingTransaction(t)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  編輯
                </button>
                <button
                  onClick={() => setDeletingId(t.id)}
                  className="text-xs text-destructive/80 hover:text-destructive"
                >
                  刪除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
