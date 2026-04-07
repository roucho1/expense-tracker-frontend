"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import axios from "axios";
import { useRedirectIfAuth } from "@/hooks/useRedirectIfAuth";
import { authApi } from "@/lib/authApi";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  useRedirectIfAuth();

  function validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      setErrorMessage("請輸入正確的 Email 格式");
      setIsValid(false);
      return false;
    }
    if (password && password.length < 8) {
      setErrorMessage("密碼至少需要 8 個字元");
      setIsValid(false);
      return false;
    }
    if (confirmPassword && password !== confirmPassword) {
      setErrorMessage("密碼不一致");
      setIsValid(false);
      return false;
    }
    setErrorMessage("");
    setIsValid(true);
    return true;
  }

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await authApi.register(email, password);
      toast.success("註冊成功", { duration: 3000 });
      router.push("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          setErrorMessage(error.response?.data?.detail);
        } else if (status === 422) {
          setErrorMessage("請輸入正確的欄位格式");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-start justify-center pt-30">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <div className="sm:hidden text-center">
          <div className="text-5xl mb-2">💰</div>
          <span className="text-xl font-bold">Expense Tracker</span>
        </div>
        <div className="border rounded-lg shadow-sm p-8 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">註冊</h1>
            <p className="text-sm text-muted-foreground mt-1">
              已有帳號？
              <Link href="/login" className="underline">
                登入
              </Link>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validate()}
                className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">密碼</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validate()}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => validate()}
                className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>
            {errorMessage && (
              <p className="text-destructive text-sm">{errorMessage}</p>
            )}
            <button
              disabled={
                isLoading || !email || !password || !confirmPassword || !isValid
              }
              type="submit"
              className="bg-primary text-primary-foreground rounded py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "註冊中..." : "註冊"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
