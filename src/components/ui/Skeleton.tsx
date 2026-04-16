// components/ui/Skeleton.tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-muted dark:bg-white/5 ${className}`}
    />
  );
}
