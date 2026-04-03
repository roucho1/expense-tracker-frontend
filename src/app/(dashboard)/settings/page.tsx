"use client";

import { Category, CategoryForm } from "@/types/category";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/zh-tw";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { userResponse } from "@/types/auth";
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
import { TransactionType } from "@/types/transaction";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { categoryApi } from "@/lib/categoryApi";
import { authApi } from "@/lib/authApi";

export default function SettingsPage() {
  useRequireAuth();
  const [isExpand, setIsExpand] = useState(false);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [isCategoryLoading, setIsCategoryLoading] = useState(true);
  const [user, setUser] = useState<userResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFormSending, setIsFormSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState<string>();
  const [editingType, setEditingType] = useState<TransactionType>();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsUserLoading(true);
    setIsCategoryLoading(true);
    try {
      const [user, categoriesRes] = await Promise.all([
        authApi.getMe(),
        categoryApi.getAll(),
      ]);
      setUser(user.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        toast.error("載入失敗，請稍後再試", { duration: 5000 });
      }
    } finally {
      setIsUserLoading(false);
      setIsCategoryLoading(false);
    }
  }
  async function updatePassword(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validatePassword()) return;
    setIsFormSending(true);
    try {
      const res = await authApi.changePassword(oldPassword, newPassword);
      toast.success(res.data.message, { duration: 3000 });
      setIsExpand(false);
      setErrorMessage("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          setErrorMessage("舊密碼錯誤");
        }
      }
    } finally {
      setIsFormSending(false);
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

  function validatePassword() {
    if (oldPassword && newPassword && oldPassword === newPassword) {
      setErrorMessage("新密碼不能與舊密碼相同");
      setIsValid(false);
      return false;
    }
    if (newPassword && newPassword.length < 8) {
      setErrorMessage("密碼至少需要 8 個字元");
      setIsValid(false);
      return false;
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setErrorMessage("密碼不一致");
      setIsValid(false);
      return false;
    }
    setErrorMessage("");
    setIsValid(true);
    return true;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">使用者資訊</h2>
        </div>
        {/* 使用者資訊card */}
        <div className="border rounded-lg px-4 py-3 flex flex-col gap-2">
          {isUserLoading ? (
            <div className="text-center text-muted-foreground py-12 text-base">
              載入中...
            </div>
          ) : (
            <>
              <div>
                <span className="font-bold">帳號：</span>
                <span>{user?.email}</span>
              </div>
              <div>
                <span className="font-bold">註冊時間：</span>
                <span>{dayjs(user?.created_at).format("YYYY年MM月DD日")}</span>
              </div>
              <div>
                <button
                  onClick={() => setIsExpand(!isExpand)}
                  className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded"
                >
                  {!isExpand ? "修改密碼" : "取消修改"}
                </button>
              </div>
              <div
                className={`p-2 overflow-hidden transition-all duration-300 ${isExpand ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
              >
                <form onSubmit={updatePassword} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">舊密碼</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onBlur={() => validatePassword()}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">新密碼</label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onBlur={() => validatePassword()}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">確認密碼</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onBlur={() => validatePassword()}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                      placeholder="••••••••"
                    />
                  </div>
                  {errorMessage && (
                    <p className="text-destructive text-sm">{errorMessage}</p>
                  )}
                  <button
                    disabled={
                      isFormSending ||
                      !oldPassword ||
                      !newPassword ||
                      !confirmPassword ||
                      !isValid
                    }
                    type="submit"
                    className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isFormSending ? "修改中..." : "送出"}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 分類card*/}
      <div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">分類</h2>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-primary text-primary-foreground text-sm px-4 py-2 rounded"
            >
              + 新增分類
            </button>
          </div>
        </div>

        <div className="border rounded-lg flex flex-col divide-y">
          {isCategoryLoading ? (
            <div className="text-center text-muted-foreground py-12 text-base">
              載入中...
            </div>
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
                  className="flex items-center justify-between px-4 py-3"
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
                          className={`text-xs px-2 py-0.5 rounded-full ${c.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
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
      </div>
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
    </div>
  );
}
