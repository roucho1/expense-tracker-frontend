import { Skeleton } from "@/components/ui/Skeleton";

export default function CategorySkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 hover:bg-primary/5 dark:hover:bg-primary/10"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-15" />
            <Skeleton className="h-6 w-10" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-4 w-6" />
            <Skeleton className="h-4 w-6" />
          </div>
        </div>
      ))}
    </>
  );
}
