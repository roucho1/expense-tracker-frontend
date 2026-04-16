import HomeSkeleton from "./_components/HomeSkeleton";

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8 pb-20 sm:pb-0">
      <HomeSkeleton />
    </div>
  );
}
