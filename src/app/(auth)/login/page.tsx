"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRedirectIfAuth } from "@/hooks/useRedirectIfAuth";
import { authApi } from "@/lib/authApi";

export default function LoginPage() {
  const { setToken } = useAuthStore();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  useRedirectIfAuth();

  function validate() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("請輸入正確的 Email 格式");
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
      const res = await authApi.login(email, password);
      setToken(res.data.access_token);
      toast.success("登入成功", { duration: 3000 });
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 422 || status === 401) {
          setErrorMessage("帳號或密碼錯誤");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm border rounded-lg p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold">登入</h1>
          <p className="text-sm text-muted-foreground mt-1">
            還沒有帳號？
            <Link href="/register" className="underline">
              註冊
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
              className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}
          <button
            disabled={isLoading || !email || !password || !isValid}
            type="submit"
            className="bg-primary text-primary-foreground rounded py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "登入中..." : "登入"}
          </button>
        </form>
      </div>
    </div>
  );
}
