"use client";

import { formatAmount } from "@/lib/chartUtils";
import { CircleDollarSign, ShoppingCart, Wallet } from "lucide-react";

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

interface Props {
  totalIncome: number;
  totalExpense: number;
  net: number;
}

export default function AnalysisStats({
  totalIncome,
  totalExpense,
  net,
}: Props) {
  return (
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
  );
}
