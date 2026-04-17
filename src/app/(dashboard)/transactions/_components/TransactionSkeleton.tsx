import { Skeleton } from "@/components/ui/Skeleton";
import { Download } from "lucide-react";

export default function TransactionSkeleton() {
  return (
    <>
      {/* 標題 + 新增按鈕 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">記帳紀錄</h1>
        <button
          disabled
          className="disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground text-sm px-4 py-2 rounded"
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
              disabled
              className={`disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 ${"all" === f ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {f === "all" ? "全部" : f === "income" ? "收入" : "支出"}
            </button>
          ))}
        </div>
        <button
          disabled
          className="disabled:opacity-50 disabled:cursor-not-allowed border border-primary text-primary rounded px-3 py-2 text-sm flex items-center gap-1 hover:bg-primary/10 dark:hover:bg-primary/15"
        >
          <Download size={16} />
          <span className="sm:hidden">匯出</span>
          <span className="hidden sm:inline">匯出 CSV</span>
        </button>
      </div>

      {/* 篩選：分類 */}
      <div className="flex gap-2 flex-wrap">
        {[...Array(6)].map((_, i) => {
          const widths = ["w-12", "w-16", "w-20", "w-14"];
          const widthClass = widths[i % widths.length];
          return (
            <Skeleton key={i} className={`h-7.5 ${widthClass} rounded-full`} />
          );
        })}
      </div>
      {/* 日期篩選 */}
      <div className="flex gap-6 flex-wrap items-center">
        <div>
          <label className="text-sm font-medium">開始日期：</label>
          <input
            type="date"
            disabled
            className="disabled:opacity-50 disabled:cursor-not-allowed border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm font-medium">結束日期：</label>
          <input
            type="date"
            disabled
            className="disabled:opacity-50 disabled:cursor-not-allowed border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          disabled
          className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          清除
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
          <div
            key={t}
            className="border rounded-lg shadow-sm px-4 py-3 flex items-center justify-between hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
          >
            <div className="flex flex-col gap-1">
              <Skeleton className="h-5 w-10 px-3 py-1" />
              <Skeleton className="h-4 w-23 px-3 py-1" />
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-10 px-3 py-1" />
              <button
                disabled
                className="disabled:opacity-50 disabled:cursor-not-allowed text-xs text-muted-foreground hover:text-foreground"
              >
                編輯
              </button>
              <button
                disabled
                className="disabled:opacity-50 disabled:cursor-not-allowed text-xs text-destructive/80 hover:text-destructive"
              >
                刪除
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
