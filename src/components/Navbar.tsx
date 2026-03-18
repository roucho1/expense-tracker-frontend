import Link from "next/link";

export default function Navbar() {
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
        <Link href="/login">登入</Link>
        <Link href="/register">註冊</Link>
      </div>
    </nav>
  );
}
