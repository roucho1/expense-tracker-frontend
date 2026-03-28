"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { token, clearToken } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);
  return (
    <nav className="border-b px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-bold text-lg">
          💰 Expense Tracker
        </Link>
        <Link href="/transactions">記帳</Link>
        <Link href="/analytics">分析</Link>
      </div>
      <div className="flex items-center gap-3">
        {mounted ? (
          token ? (
            <>
              <Link href="/settings">設定</Link>
              <button onClick={clearToken}>登出</button>
            </>
          ) : (
            <>
              <Link href="/login">登入</Link>
              <Link href="/register">註冊</Link>
            </>
          )
        ) : null}
      </div>
    </nav>
  );
}
