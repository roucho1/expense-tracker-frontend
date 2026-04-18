"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import { categoryApi } from "@/lib/categoryApi";
import {
  aggregateByCategory,
  aggregateByPeriod,
  ChartType,
  PIE_COLORS,
  TimePeriod,
} from "@/lib/chartUtils";
import { transactionApi } from "@/lib/transactionApi";
import { Category } from "@/types/category";
import { Transaction } from "@/types/transaction";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import AnalysisStats from "./_components/AnalysisStats";
import AnalysisCharts from "./_components/AnalysisCharts";
import ExpenseDetails from "./_components/ExpenseDetails";
import AnalyticsSkeleton from "./_components/AnalyticsSkeleton";

export default function AnalyticsContainer() {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 pb-20 sm:pb-0">
      <h1 className="text-xl font-bold">收支分析</h1>
      {isLoading ? (
        <AnalyticsSkeleton />
      ) : (
        <>
          {/* 統計卡片 */}
          <AnalysisStats
            totalExpense={totalExpense}
            totalIncome={totalIncome}
            net={net}
          ></AnalysisStats>
          {transactions.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 text-base">
              📝 還沒有記帳紀錄，快去新增第一筆吧！
            </div>
          ) : (
            <>
              {/* 長條圖/折線圖/圓餅圖 */}
              <AnalysisCharts
                chartType={chartType}
                setChartType={setChartType}
                period={period}
                setPeriod={setPeriod}
                periodData={periodData}
                categoryData={categoryData}
                categoryColorMap={categoryColorMap}
              ></AnalysisCharts>

              {/* 分類明細表 */}
              <ExpenseDetails
                totalExpense={totalExpense}
                categoryData={categoryData}
                categoryColorMap={categoryColorMap}
              ></ExpenseDetails>
            </>
          )}
        </>
      )}
    </div>
  );
}
