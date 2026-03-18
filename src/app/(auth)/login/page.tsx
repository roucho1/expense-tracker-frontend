"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    console.log({ email, password });
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
          <button
            type="submit"
            className="bg-primary text-primary-foreground rounded py-2 text-sm font-medium mt-2"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
}
