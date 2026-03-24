// src/hooks/useRequireAuth.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useRequireAuth() {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.push("/login");
  }, [token, router]);

  return token;
}
