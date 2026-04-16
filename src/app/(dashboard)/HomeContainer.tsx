// 首頁API呼叫及Layout呈現

"use client";

import WelcomeModal from "@/components/WelcomeModal";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { categoryApi } from "@/lib/categoryApi";
import { transactionApi } from "@/lib/transactionApi";
import { Category } from "@/types/category";
import {
  sortByDateDesc,
  Transaction,
  TransactionForm,
} from "@/types/transaction";
import axios from "axios";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import RecentTransactionsSection from "./_components/RecentTransactionsSection";
import OverviewSection from "./_components/OverviewSection";
import HomeSkeleton from "./_components/HomeSkeleton";

export const periods = ["日", "週", "月"] as const;
export type Period = (typeof periods)[number];
export interface Stats {
  income: number;
  expense: number;
  balance: number;
}
dayjs.extend(weekday);
dayjs.locale("zh-tw");
// 今天日期
const startOfDay = dayjs().format("YYYY-MM-DD");
// 這週第一天的日期
const startOfWeek = dayjs().weekday(0).format("YYYY-MM-DD");
// 這個月第一天的日期
const startOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");

export default function HomeContainer() {
  useRequireAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]); // 全部，用來算統計
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    [],
  ); // 最近5筆，用來顯示列表
  const [categories, setCategories] = useState<Category[]>([]);
  const [openWelcomeModal, setOpenWelcomeModal] = useState(false);

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
  const stats: Stats = useMemo(() => {
    const income = filteredForChart
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredForChart
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [filteredForChart]);

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
      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          {/* 總覽 */}
          <OverviewSection
            period={period}
            setPeriod={setPeriod}
            stats={stats}
            filteredForChart={filteredForChart}
            categories={categories}
          ></OverviewSection>

          {/* 最近記帳紀錄 */}
          <RecentTransactionsSection
            recentTransactions={recentTransactions}
            categories={categories}
            addTransaction={addTransaction}
          ></RecentTransactionsSection>

          <WelcomeModal
            open={openWelcomeModal}
            onClose={() => setOpenWelcomeModal(false)}
          />
        </>
      )}
    </div>
  );
}
