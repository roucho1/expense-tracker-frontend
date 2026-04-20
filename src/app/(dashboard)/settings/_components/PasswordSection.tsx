"use client";

import { authApi } from "@/lib/authApi";
import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";

export default function PasswordSection() {
  const [isExpand, setIsExpand] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFormSending, setIsFormSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isValid, setIsValid] = useState(false);

  async function updatePassword(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!validatePassword()) return;
    setIsFormSending(true);
    try {
      const res = await authApi.changePassword(oldPassword, newPassword);
      toast.success(res.data.message, { duration: 3000 });
      setIsExpand(false);
      setErrorMessage("");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          setErrorMessage("舊密碼錯誤");
        }
      }
    } finally {
      setIsFormSending(false);
    }
  }

  function validatePassword() {
    if (oldPassword && newPassword && oldPassword === newPassword) {
      setErrorMessage("新密碼不能與舊密碼相同");
      setIsValid(false);
      return false;
    }
    if (newPassword && newPassword.length < 8) {
      setErrorMessage("密碼至少需要 8 個字元");
      setIsValid(false);
      return false;
    }
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setErrorMessage("密碼不一致");
      setIsValid(false);
      return false;
    }
    setErrorMessage("");
    setIsValid(true);
    return true;
  }
  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsExpand(!isExpand)}
        className={`${isExpand ? "border border-primary text-primary" : "bg-primary text-primary-foreground"} text-sm px-4 py-2 rounded w-fit`}
      >
        {!isExpand ? "修改密碼" : "取消修改"}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isExpand ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"}`}
      >
        <form
          onSubmit={updatePassword}
          className="flex flex-col gap-4 w-full max-w-60 px-0.5"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">舊密碼</label>
            <input
              type="password"
              required
              value={oldPassword}
              onBlur={() => validatePassword()}
              onChange={(e) => setOldPassword(e.target.value)}
              className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">新密碼</label>
            <input
              type="password"
              required
              value={newPassword}
              onBlur={() => validatePassword()}
              onChange={(e) => setNewPassword(e.target.value)}
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
              onBlur={() => validatePassword()}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
          {errorMessage && (
            <p className="text-destructive text-sm">{errorMessage}</p>
          )}
          <button
            disabled={
              isFormSending ||
              !oldPassword ||
              !newPassword ||
              !confirmPassword ||
              !isValid
            }
            type="submit"
            className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFormSending ? "修改中..." : "送出"}
          </button>
        </form>
      </div>
    </div>
  );
}
