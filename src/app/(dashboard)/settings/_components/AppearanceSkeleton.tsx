import { Skeleton } from "@/components/ui/Skeleton";

export default function AppearanceSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-6 w-19" />
      <div className="flex gap-2.5">
        <div className="flex gap-1 items-center">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-6 w-19" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-6 w-19" />
        </div>
        <div className="flex items-center">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-6 w-19" />
        </div>
      </div>
    </div>
  );
}
