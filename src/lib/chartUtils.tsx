import { Category } from "@/types/category";
import { sortByDateAsc, Transaction } from "@/types/transaction";
import dayjs from "dayjs";

// ── 型別 ──────────────────────────────────────────────
export type ChartType = "bar" | "line" | "pie";
export type TimePeriod = "day" | "week" | "month";
//圓餅圖基本色
export const PIE_COLORS = [
  "#f97316",
  "#3b82f6",
  "#a855f7",
  "#22c55e",
  "#94a3b8",
  "#ec4899",
];

// ── 工具函式 ──────────────────────────────────────────
export function formatAmount(n: number) {
  return `$${n.toLocaleString()}`;
}

/** 把 date string 轉成對應的 label */
export function getLabel(date: string, period: TimePeriod): string {
  const d = dayjs(date);
  if (period === "day") return d.format("MM-DD");
  if (period === "month") return `${d.month() + 1}月`;
  return `第${d.isoWeek()}週`;
}

/** 依時間維度彙整收支 */
export function aggregateByPeriod(
  transactions: Transaction[],
  period: TimePeriod,
) {
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
export function aggregateByCategory(
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
export function CustomTooltip({ active, payload, label }: any) {
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

export function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="bg-background border border-border rounded-lg shadow-lg p-3 text-sm">
      <p className="font-semibold text-foreground">{name}</p>
      <p className="text-muted-foreground">{formatAmount(value)}</p>
    </div>
  );
}
