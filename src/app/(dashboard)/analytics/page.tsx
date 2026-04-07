"use client";

import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Transaction } from "@/types/transaction";
import { Category } from "@/types/category";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { categoryApi } from "@/lib/categoryApi";
import { transactionApi } from "@/lib/transactionApi";
import { CircleDollarSign, ShoppingCart, Wallet } from "lucide-react";
import {
  aggregateByCategory,
  aggregateByPeriod,
  ChartType,
  CustomTooltip,
  formatAmount,
  PIE_COLORS,
  PieTooltip,
  TimePeriod,
} from "@/lib/chartUtils";
import { useTheme } from "next-themes";
dayjs.extend(isoWeek);

// ── 統計卡片 ──────────────────────────────────────────
function StatCard({
  label,
  value,
  color,
  bgColor,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border shadow-sm p-4 ${bgColor}`}>
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
      <p className={`text-lg sm:text-2xl font-bold ${color}`}>
        {formatAmount(value)}
      </p>
    </div>
  );
}

// ── 主元件 ────────────────────────────────────────────
export default function AnalyticsPage() {
  useRequireAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [period, setPeriod] = useState<TimePeriod>("month");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [categoriesRes, transactionsRes] = await Promise.all([
        categoryApi.getAll(),
        transactionApi.getAll(),
      ]);
      setCategories(categoriesRes.data);
      setTransactions(transactionsRes.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        toast.error("載入失敗，請稍後再試", { duration: 5000 });
      }
    } finally {
      setIsLoading(false);
    }
  }

  // 彙整資料
  const periodData = useMemo(
    () => aggregateByPeriod(transactions, period),
    [transactions, period],
  );
  const categoryData = useMemo(
    () => aggregateByCategory(transactions, categories),
    [transactions, categories],
  );

  // 總計
  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const totalExpense = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoryData.forEach((item, index) => {
      map[item.name] = PIE_COLORS[index % PIE_COLORS.length];
    });
    return map;
  }, [categoryData]);
  const net = totalIncome - totalExpense;

  const isPie = chartType === "pie";

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 pb-20 sm:pb-0">
      {/* 標題 */}
      <h1 className="text-xl font-bold">收支分析</h1>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-12 text-base">
          載入中...
        </div>
      ) : (
        <>
          {/* 統計卡片 */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              label="總收入"
              value={totalIncome}
              color="text-green-600"
              bgColor="bg-green-50 dark:bg-green-950/50"
              icon={<CircleDollarSign size={18} className="text-green-500" />}
            />
            <StatCard
              label="總支出"
              value={totalExpense}
              color="text-red-500"
              bgColor="bg-red-50 dark:bg-red-950/40"
              icon={<ShoppingCart size={18} className="text-red-500" />}
            />
            <StatCard
              label="淨收支"
              value={net}
              color={net >= 0 ? "text-blue-600" : "text-red-500"}
              bgColor={
                net >= 0
                  ? "bg-blue-50 dark:bg-blue-950/40"
                  : "bg-red-50 dark:bg-red-950/40"
              }
              icon={
                <Wallet
                  size={18}
                  className={net >= 0 ? "text-blue-500" : "text-red-500"}
                />
              }
            />
          </div>
          {transactions.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 text-base">
              📝 還沒有記帳紀錄，快去新增第一筆吧！
            </div>
          ) : (
            <>
              {/* 圖表區 */}
              <div className="rounded-xl border shadow-sm p-6 flex flex-col gap-4">
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
                          onClick={() => setChartType(type)}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                            chartType === type
                              ? "bg-primary shadow text-primary-foreground"
                              : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                          }`}
                        >
                          {labels[type]}
                        </button>
                      );
                    })}
                  </div>

                  {/* 時間維度（圓餅圖時隱藏） */}
                  {!isPie && (
                    <div className="flex gap-1 bg-primary/10 rounded-lg p-1">
                      {(["day", "week", "month"] as TimePeriod[]).map((p) => {
                        const labels = { day: "日", week: "週", month: "月" };
                        return (
                          <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                              period === p
                                ? "bg-primary shadow text-primary-foreground"
                                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            }`}
                          >
                            {labels[p]}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 圖表本體 */}
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    {/* 長條圖：收入 vs 支出 grouped */}
                    {chartType === "bar" ? (
                      <BarChart data={periodData} barGap={4}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
                          }
                        />
                        <XAxis
                          dataKey="label"
                          tick={{
                            fontSize: 12,
                            fill: isDark ? "#9ca3af" : "#6b7280",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 12,
                            fill: isDark ? "#9ca3af" : "#6b7280",
                          }}
                          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                          dataKey="income"
                          name="收入"
                          fill="#22c55e"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="expense"
                          name="支出"
                          fill="#f97316"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    ) : chartType === "line" ? (
                      /* 折線圖：每日/週/月 淨額趨勢 */
                      <LineChart data={periodData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={
                            isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
                          }
                        />
                        <XAxis
                          dataKey="label"
                          tick={{
                            fontSize: 12,
                            fill: isDark ? "#9ca3af" : "#6b7280",
                          }}
                        />
                        <YAxis
                          tick={{
                            fontSize: 12,
                            fill: isDark ? "#9ca3af" : "#6b7280",
                          }}
                          tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="income"
                          name="收入"
                          stroke="#22c55e"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="expense"
                          name="支出"
                          stroke="#f97316"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="net"
                          name="淨收支"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    ) : (
                      /* 圓餅圖：支出分類佔比 */
                      <PieChart>
                        <Pie
                          data={categoryData.map((item, index) => ({
                            ...item,
                            fill:
                              categoryColorMap[item.name] ??
                              PIE_COLORS[index % PIE_COLORS.length],
                          }))}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={50}
                          labelLine={true}
                        />
                        <Tooltip content={<PieTooltip />} />
                      </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* 分類明細表 */}
              <div className="rounded-xl border shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400 mb-4">
                  支出分類明細
                </h2>
                <div className="space-y-3">
                  {categoryData
                    .sort((a, b) => b.value - a.value)
                    .map((item) => {
                      const pct = Math.round((item.value / totalExpense) * 100);
                      return (
                        <div key={item.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-200 font-medium">
                              {item.name}
                            </span>
                            <span className="text-gray-500 dark:text-gray-300">
                              {formatAmount(item.value)}　{pct}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${pct}%`,
                                backgroundColor:
                                  categoryColorMap[item.name] ?? "#94a3b8",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
