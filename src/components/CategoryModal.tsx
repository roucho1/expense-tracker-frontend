"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "@/types/category";
import { TransactionType } from "@/types/transaction";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryForm) => void;
}

export default function CategoryModal({ open, onClose, onSubmit }: Props) {
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<TransactionType>("expense");

  function handleClose() {
    setName("");
    setType("expense");
    onClose();
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    onSubmit({ name, type });
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新增分類</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          {/* 分類名稱 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">分類名稱</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="午餐、捷運..."
            />
          </div>
          {/* 類型 */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">類型</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TransactionType)}
              className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring bg-background"
            >
              <option value="expense">支出</option>
              <option value="income">收入</option>
            </select>
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
