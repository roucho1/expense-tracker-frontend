import { Skeleton } from "@/components/ui/Skeleton";

export default function UserSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <Skeleton className="h-6 w-35" />
      <Skeleton className="h-6 w-50" />
    </div>
  );
}
