"use client";

import { useAuthStore } from "@/store/authStore";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const { token, clearToken } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setMounted(true);
  }, []);
  return (
    <nav className="border-b-2 border-gray-300">
      <div className="flex items-center justify-between px-6 py-4">
        {/* 左：Logo + 桌面版連結 */}
        <div className="hidden sm:flex items-center gap-3">
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

        {/* 手機版 Logo */}
        <Link href="/" className="sm:hidden font-bold text-lg">
          💰 Expense Tracker
        </Link>

        {/* 右：設定/登出 + 漢堡按鈕 */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
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
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="flex flex-col border-t-2 border-gray-300 px-6 py-4">
          {mounted && token ? (
            <>
              <Link
                href="/transactions"
                className="py-3 px-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                記帳
              </Link>
              <Link
                href="/analytics"
                className="py-3 px-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                分析
              </Link>
              <Link
                href="/settings"
                className="py-3 px-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                設定
              </Link>
              <button
                className="text-left py-3 px-2 hover:bg-gray-100 rounded"
                onClick={() => {
                  clearToken();
                  router.push("/login");
                  setIsMenuOpen(false);
                }}
              >
                登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="py-3 px-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                登入
              </Link>
              <Link
                href="/register"
                className="py-3 px-2 hover:bg-gray-100 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                註冊
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
