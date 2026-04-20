"use client";

import { categoryApi } from "@/lib/categoryApi";
import { Category, CategoryForm } from "@/types/category";
import { TransactionType } from "@/types/transaction";
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
import CategoryModal from "@/components/CategoryModal";
import CategorySkeleton from "./CategorySkeleton";

export default function CategoryManager() {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>();
  const [editingType, setEditingType] = useState<TransactionType>();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const categoriesRes = await categoryApi.getAll();
      setCategories(categoriesRes.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        toast.error("載入失敗，請稍後再試", { duration: 5000 });
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function addCategory(data: CategoryForm) {
    try {
      const res = await categoryApi.create(data);
      toast.success("新增成功", { duration: 3000 });
      setCategories((prev) => [...prev, res.data]);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("新增失敗，請稍後再試", { duration: 5000 });
      }
    }
  }
  async function updateCategory(id: number, data: CategoryForm) {
    try {
      await await categoryApi.update(id, data);
      toast.success("編輯成功", { duration: 3000 });
      setCategories((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, name: data.name, type: data.type } : c,
        ),
      );
      setEditingId(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("編輯失敗，請稍後再試", { duration: 5000 });
      }
    }
  }
  async function deleteCategory(id: number) {
    try {
      await categoryApi.delete(id);
      toast.success("刪除成功", { duration: 3000 });
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setDeletingId(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error("刪除失敗，請稍後再試", { duration: 5000 });
      }
    }
  }
  return (
    <>
      <section className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">分類</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded"
            >
              + 新增分類
            </button>
          </div>
        </div>

        <div className="border rounded-lg shadow-sm flex flex-col divide-y">
          {isLoading ? (
            <CategorySkeleton />
          ) : (
            <>
              {categories.length === 0 && (
                <div className="text-center text-muted-foreground py-8 text-sm">
                  還沒有分類，點擊右上角新增第一個吧！
                </div>
              )}
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-4 py-3 hover:bg-primary/5 dark:hover:bg-primary/10"
                >
                  <div className="flex items-center gap-3">
                    {editingId === c.id ? (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <input
                            type="text"
                            required
                            value={editingName}
                            onChange={(e) =>
                              setEditingName(e.target.value as string)
                            }
                            className="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                            placeholder="午餐、捷運..."
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <select
                            value={editingType}
                            onChange={(e) =>
                              setEditingType(e.target.value as TransactionType)
                            }
                            className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring bg-background"
                          >
                            <option value="expense">支出</option>
                            <option value="income">收入</option>
                          </select>
                        </div>
                      </>
                    ) : (
                      <>
                        <span>{c.name}</span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${c.type === "income" ? "bg-green-100 text-green-600 dark:bg-green-950/60 dark:text-green-400" : "bg-red-100 text-red-500 dark:bg-red-950/60 dark:text-red-400"}`}
                        >
                          {c.type === "income" ? "收入" : "支出"}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {editingId === c.id && (
                      <button
                        onClick={async () => {
                          await updateCategory(editingId, {
                            name: editingName!,
                            type: editingType!,
                          });
                        }}
                        disabled={!editingName}
                        className="text-xs text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        儲存
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setEditingId(editingId === c.id ? null : c.id);
                        setEditingName(c.name);
                        setEditingType(c.type);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {editingId === c.id ? "取消編輯" : "編輯"}
                    </button>
                    <button
                      onClick={() => setDeletingId(c.id)}
                      className="text-xs text-destructive/80 hover:text-destructive"
                    >
                      刪除
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </section>
      <CategoryModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        onSubmit={async (data) => {
          await addCategory(data);
          setModalOpen(false);
        }}
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
                deletingId && (await deleteCategory(deletingId))
              }
            >
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
