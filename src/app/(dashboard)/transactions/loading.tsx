import TransactionSkeleton from "./_components/TransactionSkeleton";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6 pb-20 sm:pb-0">
      <TransactionSkeleton />
    </div>
  );
}
