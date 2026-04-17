"use client";

import TransactionModal from "@/components/TransactionModal";
import { Category } from "@/types/category";
import {
  Transaction,
  TransactionForm,
  createEmptyForm,
  sortByDateDesc,
  FilterState,
} from "@/types/transaction";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
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
import TransactionFilters from "./_components/TransactionFilters";
import TransactionList from "./_components/TransactionList";
import TransactionSkeleton from "./_components/TransactionSkeleton";

export default function TransactionsContainer() {
  useRequireAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    type: "all",
    categoryId: null,
    startDate: "",
    endDate: "",
  });
  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };
  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchType = filters.type === "all" || t.type === filters.type;
      const matchCategory =
        filters.categoryId === null ||
        (filters.categoryId === 0
          ? t.category_id === null
          : t.category_id === filters.categoryId);
      return matchType && matchCategory;
    });
  }, [transactions, filters]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (filters.startDate || filters.endDate) {
      setIsFetching(true);
    }
    getTransactions(filters.startDate, filters.endDate).finally(() =>
      setIsFetching(false),
    );
  }, [filters.startDate, filters.endDate]);

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
  async function getTransactions(startDate?: string, endDate?: string) {
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 pb-20 sm:pb-0">
      {isLoading ? (
        <TransactionSkeleton />
      ) : (
        <>
          {/* 記帳紀錄標題/新增按鈕/收支類型篩選/分類篩選/日期篩選 */}
          <TransactionFilters
            transactions={transactions}
            categories={categories}
            setModalOpen={setModalOpen}
            filters={filters}
            onFilterChange={handleFilterChange}
            isFetching={isFetching}
          ></TransactionFilters>

          {/* 記帳列表 */}
          <TransactionList
            transactions={transactions}
            filtered={filtered}
            categories={categories}
            setEditingTransaction={setEditingTransaction}
            setDeletingId={setDeletingId}
          ></TransactionList>
        </>
      )}

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
