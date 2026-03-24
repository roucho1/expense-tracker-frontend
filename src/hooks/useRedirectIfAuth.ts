import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// src/hooks/useRedirectIfAuth.ts
export function useRedirectIfAuth() {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token) router.push("/");
  }, [token, router]);
}
