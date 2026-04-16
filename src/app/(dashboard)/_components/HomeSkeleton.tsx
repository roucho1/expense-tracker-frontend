import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

export default function HomeSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">總覽</h2>
          <div className="flex border rounded overflow-hidden text-sm">
            {["日", "週", "月"].map((p) => (
              <button
                key={p}
                className={`px-3 py-1 opacity-50 ${"月" === p ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        {/* 統計卡片 */}
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border rounded-lg shadow-sm p-4 flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-full" /> {/* 圖標位置 */}
                <Skeleton className="h-4 w-12" /> {/* 文字標籤 */}
              </div>
              <Skeleton className="h-8 w-24" /> {/* 數字位置 */}
            </div>
          ))}
        </div>
        {/* 支出占比/圓餅圖表 */}
        <div className="rounded-xl border shadow-sm p-4 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm text-muted-foreground">
              支出分類佔比
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* 模擬旁邊的分類清單 */}
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-16" />
                    <div className="flex gap-2">
                      <Skeleton className="h-5 w-10" />
                      <Skeleton className="h-5 w-10" />
                    </div>
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>

            {/* 模擬圓餅圖 */}
            <div className="h-60 flex items-center justify-center">
              <Skeleton className="h-48 w-48 rounded-full" />
            </div>
          </div>
        </div>
      </div>
      {/* 最近記帳紀錄 */}
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
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="border rounded-lg shadow-sm px-4 py-3 flex items-center justify-between hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            >
              <div className="flex flex-col gap-1.5">
                <Skeleton className="h-5 w-32" /> {/* 標題 */}
                <Skeleton className="h-3 w-20" /> {/* 分類與日期 */}
              </div>
              <Skeleton className="h-6 w-16" /> {/* 金額 */}
            </div>
          ))}
        </div>
        {/* 快速新增 */}
        <div className="flex gap-3 mt-8">
          <button
            disabled
            className="disabled:opacity-50 disabled:cursor-not-allowed flex-1 border rounded-lg shadow-sm py-3 text-sm font-medium text-red-500 border-red-200 hover:bg-red-50 dark:bg-red-950/20 dark:hover:bg-red-950/40"
          >
            + 新增支出
          </button>
          <button
            disabled
            className="disabled:opacity-50 disabled:cursor-not-allowed flex-1 border rounded-lg shadow-sm py-3 text-sm font-medium text-green-500 border-green-200 hover:bg-green-50 dark:bg-green-950/20 dark:hover:bg-green-950/40"
          >
            + 新增收入
          </button>
        </div>
      </div>
    </>
  );
}
