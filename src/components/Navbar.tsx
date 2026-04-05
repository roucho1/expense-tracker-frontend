"use client";

import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { token, clearToken } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);
  return (
    <nav className="hidden sm:block border-b-2 border-primary/30 bg-primary/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* 左：Logo + 桌面版連結 */}
        <div className="flex items-center gap-3">
          <Link href="/" className="font-bold text-lg">
            💰 Expense Tracker
          </Link>
          {mounted && token ? (
            <>
              <Link href="/transactions">記帳</Link>
              <Link href="/analytics">分析</Link>
            </>
          ) : null}
        </div>

        {/* 右：設定/登出 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {mounted ? (
              token ? (
                <>
                  <Link href="/settings">設定</Link>
                  <button
                    onClick={() => {
                      clearToken();
                      router.push("/login");
                    }}
                  >
                    登出
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">登入</Link>
                  <Link href="/register">註冊</Link>
                </>
              )
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}
