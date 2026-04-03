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
import { Transaction, sortByDateAsc } from "@/types/transaction";
import { Category } from "@/types/category";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { categoryApi } from "@/lib/categoryApi";
import { transactionApi } from "@/lib/transactionApi";
import { CircleDollarSign, ShoppingCart, Wallet } from "lucide-react";
dayjs.extend(isoWeek);

// ── 型別 ──────────────────────────────────────────────
type ChartType = "bar" | "line" | "pie";
type TimePeriod = "day" | "week" | "month";
//圓餅圖基本色
const PIE_COLORS = [
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#22c55e",
  "#94a3b8",
  "#ec4899",
];

// ── 工具函式 ──────────────────────────────────────────
function formatAmount(n: number) {
  return `$${n.toLocaleString()}`;
}

/** 把 date string 轉成對應的 label */
function getLabel(date: string, period: TimePeriod): string {
  const d = dayjs(date);
  if (period === "day") return d.format("MM-DD");
  if (period === "month") return `${d.month() + 1}月`;
  return `第${d.isoWeek()}週`;
}

/** 依時間維度彙整收支 */
function aggregateByPeriod(transactions: Transaction[], period: TimePeriod) {
  const map = new Map<
    string,
    { income: number; expense: number; net: number }
  >();

  const sorted = sortByDateAsc(transactions);
  sorted.forEach((t) => {
    const label = getLabel(t.date, period);
    const current = map.get(label) ?? { income: 0, expense: 0, net: 0 };
    if (t.type === "income") {
      current.income += t.amount;
      current.net += t.amount;
    } else {
      current.expense += t.amount;
      current.net -= t.amount;
    }
    map.set(label, current);
  });

  return Array.from(map.entries()).map(([label, v]) => ({ label, ...v }));
}

/** 依分類彙整支出（給圓餅圖用） */
function aggregateByCategory(
  transactions: Transaction[],
  categories: Category[],
) {
  const map = new Map<string, number>();
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      const name =
        categories.find((c) => c.id === t.category_id)?.name ?? "未分類";
      map.set(name, (map.get(name) ?? 0) + t.amount);
    });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

// ── 自訂 Tooltip ──────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-foreground mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}：{formatAmount(entry.value)}
        </p>
      ))}
    </div>
  );
}

function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-foreground">{name}</p>
      <p className="text-muted-foreground">{formatAmount(value)}</p>
    </div>
  );
}

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
    <div
      className={`rounded-xl border border-gray-100 shadow-sm p-4 ${bgColor}`}
    >
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
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
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
              bgColor="bg-green-50"
              icon={<CircleDollarSign size={18} className="text-green-500" />}
            />
            <StatCard
              label="總支出"
              value={totalExpense}
              color="text-red-500"
              bgColor="bg-red-50"
              icon={<ShoppingCart size={18} className="text-red-500" />}
            />
            <StatCard
              label="淨收支"
              value={net}
              color={net >= 0 ? "text-blue-600" : "text-red-500"}
              bgColor={net >= 0 ? "bg-blue-50" : "bg-red-50"}
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
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
                {/* 控制列 */}
                <div className="flex flex-wrap gap-3 items-center justify-between">
                  {/* 圖表類型 */}
                  <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
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
                              ? "bg-white shadow text-gray-800"
                              : "text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {labels[type]}
                        </button>
                      );
                    })}
                  </div>

                  {/* 時間維度（圓餅圖時隱藏） */}
                  {!isPie && (
                    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                      {(["day", "week", "month"] as TimePeriod[]).map((p) => {
                        const labels = { day: "日", week: "週", month: "月" };
                        return (
                          <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                              period === p
                                ? "bg-white shadow text-gray-800"
                                : "text-gray-500 hover:text-gray-700"
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                        <YAxis
                          tick={{ fontSize: 12 }}
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
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                        <YAxis
                          tick={{ fontSize: 12 }}
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
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-base font-semibold text-gray-700 mb-4">
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
                            <span className="text-gray-700 font-medium">
                              {item.name}
                            </span>
                            <span className="text-gray-500">
                              {formatAmount(item.value)}　{pct}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
