// components/ThemedToaster.tsx
"use client";

import { Toaster } from "sonner";
import { useTheme } from "next-themes";

export default function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme as "light" | "dark" | "system"} />;
}
