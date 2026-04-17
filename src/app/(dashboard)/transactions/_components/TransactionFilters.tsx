"use client";

import { exportToCSV } from "@/lib/exportUtils";
import { Category } from "@/types/category";
import { FilterState, Transaction } from "@/types/transaction";
import { Download } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  transactions: Transaction[];
  categories: Category[];
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  isFetching: boolean;
}

export default function TransactionFilters({
  transactions,
  categories,
  setModalOpen,
  filters,
  onFilterChange,
  isFetching,
}: Props) {
  // 清除篩選
  function handleClear() {
    onFilterChange({ startDate: "", endDate: "" });
  }
  return (
    <>
      {/* 標題 + 新增按鈕 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">記帳紀錄</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded"
        >
          + 新增
        </button>
      </div>

      {/* 篩選：收支類型 */}
      <div className="flex items-center justify-between">
        <div className="border border-primary/50 rounded overflow-hidden text-sm">
          {(["all", "income", "expense"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                onFilterChange({ type: f, categoryId: null });
              }}
              className={`px-4 py-1.5 ${filters.type === f ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {f === "all" ? "全部" : f === "income" ? "收入" : "支出"}
            </button>
          ))}
        </div>
        <button
          onClick={() => exportToCSV(transactions, categories)}
          className="border border-primary text-primary rounded px-3 py-2 text-sm flex items-center gap-1 hover:bg-primary/10 dark:hover:bg-primary/15"
        >
          <Download size={16} />
          <span className="sm:hidden">匯出</span>
          <span className="hidden sm:inline">匯出 CSV</span>
        </button>
      </div>

      {/* 篩選：分類 */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() =>
            onFilterChange({ type: filters.type, categoryId: null })
          }
          className={`text-sm px-3 py-1 rounded-full border border-primary/50 ${
            filters.categoryId === null
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          全部
        </button>
        <button
          onClick={() => onFilterChange({ type: filters.type, categoryId: 0 })}
          className={`text-sm px-3 py-1 rounded-full border border-primary/50 ${
            filters.categoryId === 0
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          未分類
        </button>
        {categories
          .filter((c) => filters.type === "all" || c.type === filters.type)
          .map((c) => (
            <button
              key={c.id}
              onClick={() =>
                onFilterChange({ type: filters.type, categoryId: c.id })
              }
              className={`text-sm px-3 py-1 rounded-full border border-primary/50 ${
                filters.categoryId === c.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {c.name}
            </button>
          ))}
      </div>
      {/* 日期篩選 */}
      <div className="flex gap-6 flex-wrap items-center">
        <div>
          <label className="text-sm font-medium">開始日期：</label>
          <input
            type="date"
            value={filters.startDate}
            max={filters.endDate || undefined}
            onChange={(e) => onFilterChange({ startDate: e.target.value })}
            className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm font-medium">結束日期：</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange({ endDate: e.target.value })}
            min={filters.startDate || undefined}
            className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={handleClear}
          disabled={!filters.startDate && !filters.endDate}
          className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          清除
        </button>
        {isFetching && (
          <div className="text-sm text-muted-foreground">🔍 查詢中...</div>
        )}
      </div>
    </>
  );
}
