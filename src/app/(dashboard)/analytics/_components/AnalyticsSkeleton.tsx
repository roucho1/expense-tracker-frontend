import { Skeleton } from "@/components/ui/Skeleton";
import { ChartType, TimePeriod } from "@/lib/chartUtils";

const GroupedChartSkeleton = () => {
  const mockGroups = [
    { income: 80, expense: 60 },
    { income: 40, expense: 90 },
    { income: 70, expense: 30 },
    { income: 80, expense: 60 },
    { income: 40, expense: 90 },
  ];

  return (
    <div className="flex-1 flex flex-col pl-5">
      <div className="flex-1 flex gap-2 max-h-55">
        {/* Y 軸數字模擬 (固定寬度) */}
        <div className="w-10 flex flex-col justify-between text-right">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton
              key={i}
              className="w-8 h-3 bg-slate-100 dark:bg-white/5 rounded ml-auto"
            />
          ))}
        </div>

        {/* 圖表主體 用 shadow 模擬 */}
        <div
          className="flex-1 flex items-end justify-between px-4 pb-2 gap-4 h-full relative [--chart-axis:#f1f5f9] dark:[--chart-axis:#333333]"
          style={{
            // 使用 shadow 模擬 L 型線條
            boxShadow: "inset 2px -2px 0px 0px var(--chart-axis)",
            // 模擬圖表背景網格線
            backgroundImage: `linear-gradient(to right, var(--chart-axis) 1px, transparent 1px), 
                      linear-gradient(to top, var(--chart-axis) 1px, transparent 1px)`,
            backgroundSize: "20% 20%",
          }}
        >
          {mockGroups.map((group, i) => (
            <div
              key={i}
              className="flex-1 flex items-end gap-1 max-w-20 h-full"
            >
              <div
                className="flex-1 bg-muted dark:bg-white/5 rounded-t-sm animate-pulse"
                style={{ height: `${group.income}%` }}
              />
              <div
                className="flex-1 bg-muted dark:bg-white/5 rounded-t-sm animate-pulse"
                style={{ height: `${group.expense}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* X 軸標籤容器 */}
      <div className="flex gap-2">
        {/* 左側佔位 */}
        <div className="w-10" />

        {/* X軸Label*/}
        <div className="flex-1 flex  justify-between px-8 pt-2 gap-4">
          {mockGroups.map((_, i) => (
            <div key={i} className="flex-1 flex max-w-10">
              <Skeleton className="w-10 h-3 bg-slate-100 dark:bg-white/5 rounded" />
            </div>
          ))}
        </div>
      </div>
      {/* 圖例 */}
      <div className="">
        {/* X軸Label*/}
        <div className="flex-1 flex justify-center pt-2 gap-3">
          <div className="flex gap-2">
            <Skeleton className="w-5 h-5 bg-slate-100 dark:bg-white/5 rounded" />
            <Skeleton className="w-10 h-5 bg-slate-100 dark:bg-white/5 rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-5 h-5 bg-slate-100 dark:bg-white/5 rounded" />
            <Skeleton className="w-10 h-5 bg-slate-100 dark:bg-white/5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AnalyticsSkeleton() {
  return (
    <>
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
            <Skeleton className="h-8 max-w-24" /> {/* 數字位置 */}
          </div>
        ))}
      </div>
      <div className="rounded-xl border shadow-sm p-6 flex flex-col gap-4 h-100">
        {/* 控制列 */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* 圖表類型 */}
          <div className="flex gap-1 bg-primary/10 rounded-lg p-1">
            {(["bar", "line", "pie"] as ChartType[]).map((type) => {
              const labels = {
                bar: "長條圖",
                line: "折線圖",
                pie: "圓餅圖",
              };
              return (
                <button
                  key={type}
                  disabled
                  className={`disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    "bar" === type
                      ? "bg-primary shadow text-primary-foreground"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {labels[type]}
                </button>
              );
            })}
          </div>

          {/* 時間維度 */}
          <div className="flex gap-1 bg-primary/10 rounded-lg p-1">
            {(["day", "week", "month"] as TimePeriod[]).map((p) => {
              const labels = { day: "日", week: "週", month: "月" };
              return (
                <button
                  key={p}
                  disabled
                  className={`disabled:opacity-50 disabled:cursor-not-allowed px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    "month" === p
                      ? "bg-primary shadow text-primary-foreground"
                      : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {labels[p]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 圖表 */}
        <GroupedChartSkeleton></GroupedChartSkeleton>
      </div>
      {/* 支出明細 */}
      <div className="rounded-xl border shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400 mb-4">
          支出分類明細
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
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
      </div>
    </>
  );
}
