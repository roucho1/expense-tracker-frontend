import { Skeleton } from "@/components/ui/Skeleton";
import UserSkeleton from "./_components/UserSkeleton";
import CategorySkeleton from "./_components/CategorySkeleton";
import AppearanceSkeleton from "./_components/AppearanceSkeleton";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 pb-20 sm:pb-0">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">使用者設定</h2>
        </div>
        {/* 使用者設定card */}
        <div className="border rounded-lg shadow-sm px-4 py-3 flex flex-col gap-4">
          {/* 使用者資訊 */}
          <UserSkeleton />

          {/* 色系選擇 */}
          <AppearanceSkeleton />

          {/* 修改密碼 */}
          <Skeleton className="h-9 w-22" />
        </div>
      </div>

      {/* 分類card*/}
      <section className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">分類</h2>
            <button
              disabled
              className="disabled:opacity-50 disabled:cursor-not-allowed bg-primary text-primary-foreground text-sm px-4 py-2 rounded"
            >
              + 新增分類
            </button>
          </div>
        </div>
        <div className="border rounded-lg shadow-sm flex flex-col divide-y">
          <CategorySkeleton />
        </div>
      </section>
    </div>
  );
}
