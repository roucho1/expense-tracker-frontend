"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TransactionForm, TransactionType } from "@/types/transaction";
import { Category } from "@/types/category";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionForm) => void;
  initialData: TransactionForm;
  categories: Category[];
}

export default function TransactionModal({
  open,
  onClose,
  onSubmit,
  initialData,
  categories,
}: Props) {
  const [form, setForm] = useState<TransactionForm>(initialData);
  useEffect(() => {
    setForm(initialData);
  }, [initialData]);

  function handleChange(field: keyof TransactionForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTypeChange(type: TransactionType) {
    setForm((prev) => ({
      ...prev,
      type,
      category_id: categories.filter((c) => c.type === type)[0]?.id ?? null,
    }));
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) {
      alert("請輸入有效金額");
      return;
    }
    onSubmit(form);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData.note ? "編輯記帳" : "新增記帳"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* 類型 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">類型</label>
            <div className="flex border rounded overflow-hidden text-sm">
              {(["expense", "income"] as const).map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleTypeChange(t)}
                  className={`flex-1 py-2 ${form.type === t ? "bg-primary text-primary-foreground" : ""}`}
                >
                  {t === "expense" ? "支出" : "收入"}
                </button>
              ))}
            </div>
          </div>

          {/* 分類 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">分類</label>
            <select
              value={form.category_id ?? ""}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  category_id:
                    e.target.value === "" ? null : Number(e.target.value),
                }));
              }}
              className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="">未分類</option>
              {categories
                .filter((c) => c.type === form.type)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>

          {/* 備註 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">備註</label>
            <input
              type="text"
              required
              value={form.note}
              onChange={(e) => handleChange("note", e.target.value)}
              className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="午餐、捷運..."
            />
          </div>

          {/* 金額 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">金額</label>
            <input
              type="number"
              required
              min="1"
              value={form.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
              className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="0"
            />
          </div>

          {/* 日期 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">日期</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
              className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded py-2 text-sm font-medium mt-2"
          >
            新增
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
