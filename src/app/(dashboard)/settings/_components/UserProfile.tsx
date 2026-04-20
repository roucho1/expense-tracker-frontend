"use client";

import { authApi } from "@/lib/authApi";
import { userResponse } from "@/types/auth";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import UserSkeleton from "./UserSkeleton";

export default function UserProfile() {
  const [user, setUser] = useState<userResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const user = await authApi.getMe();
      setUser(user.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status !== 401) {
        toast.error("載入失敗，請稍後再試", { duration: 5000 });
      }
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      {isLoading ? (
        <UserSkeleton />
      ) : (
        <div className="flex flex-col gap-1">
          <div>
            <span className="font-bold">帳號：</span>
            <span>{user?.email}</span>
          </div>
          <div>
            <span className="font-bold">註冊時間：</span>
            <span>{dayjs(user?.created_at).format("YYYY年MM月DD日")}</span>
          </div>
        </div>
      )}
    </>
  );
}
