"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ open, onClose }: Props) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">
            👋 歡迎使用 Expense Tracker！
          </DialogTitle>
          <DialogDescription className="text-base mt-2">
            🏷️ 建議先到設定頁新增分類，讓記帳更有條理。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            稍後再說
          </Button>
          <Button
            onClick={() => {
              router.push("/settings");
              onClose();
            }}
          >
            去建立分類
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
