"use client";

import { useAuthStore } from "@/store/authStore";
import { BarChart2, Home, LogOut, Receipt, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ButtomNav() {
  const { token, clearToken } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);
  return (
    <>
      {mounted && token && (
        <nav className="fixed bottom-0 left-0 right-0 border-t bg-background sm:hidden z-50">
          <div className="grid grid-cols-5 py-3">
            <Link href="/" className="flex flex-col gap-1 items-center">
              <Home size={20} />
              <span className="text-xs">首頁</span>
            </Link>
            <Link
              href="/transactions"
              className="flex flex-col gap-1 items-center"
            >
              <Receipt size={20} />
              <span className="text-xs">記帳</span>
            </Link>
            <Link
              href="/analytics"
              className="flex flex-col gap-1 items-center"
            >
              <BarChart2 size={20} />
              <span className="text-xs">分析</span>
            </Link>
            <Link href="/settings" className="flex flex-col gap-1 items-center">
              <Settings size={20} />
              <span className="text-xs">設定</span>
            </Link>
            <button
              onClick={() => {
                clearToken();
                router.push("/login");
              }}
              className="flex flex-col gap-1 items-center"
            >
              <LogOut size={20} />
              <span className="text-xs">登出</span>
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
