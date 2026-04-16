// 首頁 支出分類占比/圓餅圖表

"use client";

import {
  aggregateByCategory,
  formatAmount,
  PIE_COLORS,
  PieTooltip,
} from "@/lib/chartUtils";
import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import { useMemo } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface Props {
  filteredForChart: Transaction[];
  categories: Category[];
}

export default function ExpenseChart({ filteredForChart, categories }: Props) {
  const categoryData = useMemo(
    () => aggregateByCategory(filteredForChart, categories),
    [filteredForChart, categories],
  );
  const categoryColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    categoryData.forEach((item, index) => {
      map[item.name] = PIE_COLORS[index % PIE_COLORS.length];
    });
    return map;
  }, [categoryData]);
  const totalExpense = useMemo(
    () =>
      filteredForChart
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    [filteredForChart],
  );
  return (
    <>
      <div className="rounded-xl border shadow-sm p-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-muted-foreground">
            支出分類佔比
          </h3>
        </div>
        {categoryData.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            📊 本期間沒有支出資料
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            {/* 分類明細表 */}
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
            {/* 圖表本體 */}
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                {/* 圓餅圖：支出分類佔比 */}
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
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
