"use client";

import { useRequireAuth } from "@/hooks/useRequireAuth";
import PasswordSection from "./_components/PasswordSection";
import Appearance from "./_components/Appearance";
import UserProfile from "./_components/UserProfile";
import CategoryManager from "./_components/CategoryManager";

export default function SettingsContainer() {
  useRequireAuth();
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 pb-20 sm:pb-0">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">使用者設定</h2>
        </div>
        {/* 使用者設定card */}
        <div className="border rounded-lg shadow-sm px-4 py-3 flex flex-col gap-4">
          {/* 使用者資訊 */}
          <UserProfile />

          {/* 色系選擇 */}
          <Appearance />

          {/* 修改密碼 */}
          <PasswordSection />
        </div>
      </div>

      {/* 分類card*/}
      <CategoryManager />
    </div>
  );
}
