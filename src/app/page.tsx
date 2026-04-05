"use client";

import TransactionModal from "@/components/TransactionModal";
import { Category } from "@/types/category";
import {
  Transaction,
  TransactionForm,
  TransactionType,
  createEmptyForm,
  sortByDateDesc,
} from "@/types/transaction";
import axios from "axios";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import "dayjs/locale/zh-tw";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import WelcomeModal from "@/components/WelcomeModal";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { transactionApi } from "@/lib/transactionApi";
import { categoryApi } from "@/lib/categoryApi";
import { CircleDollarSign, ShoppingCart, Wallet } from "lucide-react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  aggregateByCategory,
  formatAmount,
  PIE_COLORS,
  PieTooltip,
} from "@/lib/chartUtils";

const periods = ["日", "週", "月"] as const;
type Period = (typeof periods)[number];
dayjs.extend(weekday);
dayjs.locale("zh-tw");
// 今天日期
const startOfDay = dayjs().format("YYYY-MM-DD");
// 這週第一天的日期
const startOfWeek = dayjs().weekday(0).format("YYYY-MM-DD");
// 這個月第一天的日期
const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");

export default function HomePage() {
  useRequireAuth();
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quickAddType, setQuickAddType] = useState<TransactionType | null>(
    null,
  );
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // 全部，用來算統計
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  ); // 最近5筆，用來顯示列表
  const [categories, setCategories] = useState<Category[]>([]);
  const [period, setPeriod] = useState<Period>("月");
  const filteredForChart = useMemo(() => {
    return allTransactions.filter((t) =>
      period === "日"
        ? t.date === startOfDay
        : period === "週"
          ? t.date >= startOfWeek
          : t.date >= startOfMonth,
    );
  }, [allTransactions, period]);
  const stats = useMemo(() => {
    const income = filteredForChart
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredForChart
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredForChart]);
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
      setAllTransactions(transactionsRes.data);
      setRecentTransactions(sortByDateDesc(transactionsRes.data).slice(0, 5));
      const hasShownWelcome = sessionStorage.getItem("welcomeShown");
      if (categoriesRes.data.length === 0 && !hasShownWelcome) {
        setOpenWelcomeModal(true);
        sessionStorage.setItem("welcomeShown", "true");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        toast.error("載入失敗，請稍後再試", { duration: 5000 });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function getTransactions() {
    try {
      const res = await transactionApi.getAll();
      setAllTransactions(res.data);
      setRecentTransactions(sortByDateDesc(res.data).slice(0, 5));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("載入失敗，請稍後再試", { duration: 5000 });
      }
    }
  }

  async function addTransaction(data: TransactionForm) {
    try {
      await transactionApi.create(data);
      toast.success("新增成功", { duration: 3000 });
      await getTransactions();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("新增失敗，請稍後再試", { duration: 5000 });
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 pb-20 sm:pb-0">
      {/* 統計卡片 */}
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">總覽</h2>
          <div className="flex border rounded overflow-hidden text-sm">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 ${period === p ? "bg-primary text-primary-foreground" : ""}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-12 text-base">
            載入中...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg shadow-sm p-4 flex flex-col gap-1 bg-green-50">
                <div className="flex items-center gap-2">
                  <CircleDollarSign size={18} className="text-green-500" />
                  <span className="text-sm text-muted-foreground">收入</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-green-500">
                  +{stats.income.toLocaleString()}
                </span>
              </div>
              <div className="border rounded-lg shadow-sm p-4 flex flex-col gap-1 bg-red-50">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-red-500" />
                  <span className="text-sm text-muted-foreground">支出</span>
                </div>
                <span className="text-lg sm:text-2xl font-bold text-red-500">
                  -{stats.expense.toLocaleString()}
                </span>
              </div>
              <div
                className={`border rounded-lg shadow-sm p-4 flex flex-col gap-1 ${stats.balance >= 0 ? "bg-blue-50" : "bg-red-50"}`}
              >
                <div className="flex items-center gap-2">
                  <Wallet
                    size={18}
                    className={
                      stats.balance >= 0 ? "text-blue-500" : "text-red-500"
                    }
                  />
                  <span className="text-sm text-muted-foreground">結餘</span>
                </div>
                <span
                  className={`text-lg sm:text-2xl font-bold ${stats.balance >= 0 ? "text-blue-500" : "text-red-500"}`}
                >
                  {stats.balance.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="rounded-xl border shadow-sm p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  支出分類佔比
                </h3>
              </div>
              {categoryData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8 text-sm">
                  📊 本期間沒有支出資料
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  {/* 分類明細表 */}
                  <div className="space-y-3">
                    {categoryData
                      .sort((a, b) => b.value - a.value)
                      .map((item) => {
                        const pct = Math.round(
                          (item.value / totalExpense) * 100,
                        );
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
        )}
      </div>

      {/* 最近紀錄 */}
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
          {isLoading ? (
            <div className="text-center text-muted-foreground py-12 text-base">
              載入中...
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center text-muted-foreground py-12 text-base">
              📝 還沒有記帳紀錄，點擊下方新增第一筆吧！
            </div>
          ) : (
            recentTransactions.map((t) => (
              <div
                key={t.id}
                className="border rounded-lg shadow-sm px-4 py-3 flex items-center justify-between hover:bg-primary/5 transition-colors"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{t.note}</span>
                  <span className="text-xs text-muted-foreground">
                    {categories.find((c) => c.id === t.category_id)?.name ??
                      "未分類"}
                    ・{t.date}
                  </span>
                </div>
                <span
                  className={`font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {t.amount.toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 快速新增 */}
      <div className="flex gap-3">
        <button
          onClick={() => setQuickAddType("expense")}
          className="flex-1 border rounded-lg shadow-sm py-3 text-sm font-medium text-red-500 border-red-200 hover:bg-red-50"
        >
          + 新增支出
        </button>
        <button
          onClick={() => setQuickAddType("income")}
          className="flex-1 border rounded-lg shadow-sm py-3 text-sm font-medium text-green-500 border-green-200 hover:bg-green-50"
        >
          + 新增收入
        </button>
      </div>
      <TransactionModal
        open={quickAddType !== null}
        onClose={() => setQuickAddType(null)}
        onSubmit={async (data) => {
          await addTransaction(data);
          setQuickAddType(null);
        }}
        initialData={createEmptyForm(quickAddType ?? "expense")}
        categories={categories}
      />
      <WelcomeModal
        open={openWelcomeModal}
        onClose={() => setOpenWelcomeModal(false)}
      />
    </div>
  );
}
