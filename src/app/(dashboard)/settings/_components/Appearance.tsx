"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import AppearanceSkeleton from "./AppearanceSkeleton";

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function Appearance() {
  const { theme, setTheme } = useTheme();

  // 伺服器端回傳 false，在客戶端回傳 true
  const isClient = useSyncExternalStore(
    emptySubscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!isClient) return <AppearanceSkeleton />;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-bold">顯示模式</span>
      <div className="flex gap-2.5">
        {["light", "dark", "system"].map((t) => (
          <label key={t} className="flex items-center gap-1">
            <input
              type="radio"
              value={t}
              checked={theme === t}
              onChange={() => setTheme(t)}
            />
            {t === "light"
              ? "☀️淺色"
              : t === "dark"
                ? "🌙深色"
                : "⚙️跟隨系統顏色"}
          </label>
        ))}
      </div>
    </div>
  );
}
