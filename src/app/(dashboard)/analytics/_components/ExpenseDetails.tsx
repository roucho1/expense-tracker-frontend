"use client";

import { formatAmount } from "@/lib/chartUtils";

interface Props {
  totalExpense: number;
  categoryData: {
    name: string;
    value: number;
  }[];
  categoryColorMap: Record<string, string>;
}

export default function ExpenseDetails({
  totalExpense,
  categoryData,
  categoryColorMap,
}: Props) {
  return (
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
                      backgroundColor: categoryColorMap[item.name] ?? "#94a3b8",
                    }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
