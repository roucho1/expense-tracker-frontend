"use client";

import {
  ChartType,
  CustomTooltip,
  PIE_COLORS,
  PieTooltip,
  TimePeriod,
} from "@/lib/chartUtils";
import { useTheme } from "next-themes";
import { Dispatch, SetStateAction } from "react";
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

interface Props {
  chartType: ChartType;
  setChartType: Dispatch<SetStateAction<ChartType>>;
  period: TimePeriod;
  setPeriod: Dispatch<SetStateAction<TimePeriod>>;
  periodData: {
    income: number;
    expense: number;
    net: number;
    label: string;
  }[];
  categoryData: {
    name: string;
    value: number;
  }[];
  categoryColorMap: Record<string, string>;
}

export default function AnalysisCharts({
  chartType,
  setChartType,
  period,
  setPeriod,
  periodData,
  categoryData,
  categoryColorMap,
}: Props) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const isPie = chartType === "pie";

  return (
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
                stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
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
                stroke={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
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
  );
}
