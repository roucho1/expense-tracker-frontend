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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { categoryApi } from "@/lib/categoryApi";
import { transactionApi } from "@/lib/transactionApi";
import { Download } from "lucide-react";

export default function TransactionsPage() {
  useRequireAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState<TransactionType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null); // null = 全部, 0 = 未分類, 其他數字 = 對應分類 id
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setIsFetching(true);
    getTransactions().finally(() => setIsFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  async function loadData() {
    setIsLoading(true);
    try {
      const [categoriesRes, transactionsRes] = await Promise.all([
        categoryApi.getAll(),
        transactionApi.getAll(),
      ]);
      setCategories(categoriesRes.data);
      setTransactions(sortByDateDesc(transactionsRes.data));
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
      const res = await transactionApi.getAll({
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });
      setTransactions(sortByDateDesc(res.data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("載入失敗，請稍後再試", { duration: 5000 });
      }
    }
  }

  const filtered = transactions.filter((t) => {
    const matchType = filter === "all" || t.type === filter;
    const matchCategory =
      categoryFilter === null ||
      (categoryFilter === 0
        ? t.category_id === null
        : t.category_id === categoryFilter);
    return matchType && matchCategory;
  });

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

  async function updateTransaction(id: number, data: TransactionForm) {
    try {
      await transactionApi.update(id, data);
      toast.success("編輯成功", { duration: 3000 });
      await getTransactions();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("編輯失敗，請稍後再試", { duration: 5000 });
      }
    }
  }

  async function deleteTransaction(id: number) {
    try {
      await transactionApi.delete(id);
      toast.success("刪除成功", { duration: 3000 });
      await getTransactions();
      setDeletingId(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("刪除失敗，請稍後再試", { duration: 5000 });
      }
    }
  }

  // 清除篩選
  function handleClear() {
    setStartDate("");
    setEndDate("");
  }

  function exportToCSV() {
    // 1. 定義欄位標題
    const headers = ["日期", "類型", "分類", "備註", "金額"];

    // 2. 把資料轉成陣列
    const rows = transactions.map((t) => [
      t.date,
      t.type === "income" ? "收入" : "支出",
      categories.find((c) => c.id === t.category_id)?.name ?? "未分類",
      `"${t.note}"`, // 避免備註逗號被拆開
      t.amount,
    ]);

    // 3. 組合成 CSV 字串
    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

    // 4. 建立下載連結
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "記帳紀錄.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 pb-20 sm:pb-0">
      {/* 標題 + 新增按鈕 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">記帳紀錄</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded"
        >
          + 新增
        </button>
      </div>

      {/* 篩選：收支類型 */}
      <div className="flex items-center justify-between">
        <div className="border border-primary/50 rounded overflow-hidden text-sm">
          {(["all", "income", "expense"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f);
                setCategoryFilter(null);
              }}
              className={`px-4 py-1.5 ${filter === f ? "bg-primary text-primary-foreground" : ""}`}
            >
              {f === "all" ? "全部" : f === "income" ? "收入" : "支出"}
            </button>
          ))}
        </div>
        <button
          onClick={() => exportToCSV()}
          className="border border-primary text-primary rounded px-3 py-2 text-sm flex items-center gap-1 hover:bg-primary/10 dark:hover:bg-primary/15"
        >
          <Download size={16} />
          <span className="sm:hidden">匯出</span>
          <span className="hidden sm:inline">匯出 CSV</span>
        </button>
      </div>

      {/* 篩選：分類 */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setCategoryFilter(null)}
          className={`text-sm px-3 py-1 rounded-full border border-primary/50 ${
            categoryFilter === null ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setCategoryFilter(0)}
          className={`text-sm px-3 py-1 rounded-full border border-primary/50 ${
            categoryFilter === 0 ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          未分類
        </button>
        {categories
          .filter((c) => filter === "all" || c.type === filter)
          .map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={`text-sm px-3 py-1 rounded-full border border-primary/50 ${
                categoryFilter === c.id
                  ? "bg-primary text-primary-foreground"
                  : ""
              }`}
            >
              {c.name}
            </button>
          ))}
      </div>
      {/* 日期篩選 */}
      <div className="flex gap-6 flex-wrap items-center">
        <div>
          <label className="text-sm font-medium">開始日期：</label>
          <input
            type="date"
            value={startDate}
            max={endDate || undefined}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div>
          <label className="text-sm font-medium">結束日期：</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            min={startDate || undefined}
            className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          onClick={handleClear}
          disabled={!startDate && !endDate}
          className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          清除
        </button>
      </div>
      {isFetching && (
        <div className="text-sm text-muted-foreground">查詢中...</div>
      )}

      {/* 列表 */}
      <div className="flex flex-col gap-2">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-12 text-base">
            載入中...
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-base">
            📝 還沒有記帳紀錄，點擊右上角新增第一筆吧！
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12 text-base">
            🔍 沒有符合條件的紀錄
          </div>
        ) : (
          filtered.map((t) => (
            <div
              key={t.id}
              className="border rounded-lg shadow-sm px-4 py-3 flex items-center justify-between hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{t.note}</span>
                <span className="text-xs text-muted-foreground">
                  {categories.find((c) => c.id === t.category_id)?.name ??
                    "未分類"}
                  ・{t.date}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`font-semibold ${t.type === "income" ? "text-green-500" : "text-red-500"}`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {t.amount.toLocaleString()}
                </span>
                <button
                  onClick={() => setEditingTransaction(t)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  編輯
                </button>
                <button
                  onClick={() => setDeletingId(t.id)}
                  className="text-xs text-destructive/80 hover:text-destructive"
                >
                  刪除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <TransactionModal
        open={modalOpen || editingTransaction !== null}
        onClose={() => {
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={async (data) => {
          if (editingTransaction) {
            await updateTransaction(editingTransaction.id, data);
          } else {
            await addTransaction(data);
          }
          setModalOpen(false);
          setEditingTransaction(null);
        }}
        initialData={
          editingTransaction
            ? {
                type: editingTransaction.type,
                category_id: editingTransaction.category_id,
                note: editingTransaction.note,
                amount: String(editingTransaction.amount),
                date: editingTransaction.date,
              }
            : createEmptyForm()
        }
        categories={categories}
      />
      <AlertDialog
        open={deletingId !== null}
        onOpenChange={() => setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要刪除？</AlertDialogTitle>
            <AlertDialogDescription>此操作無法復原</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive! hover:bg-destructive/80! text-destructive-foreground!"
              onClick={async () =>
                deletingId && (await deleteTransaction(deletingId))
              }
            >
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
