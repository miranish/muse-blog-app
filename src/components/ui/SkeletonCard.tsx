export function SkeletonCard() {
  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 p-4 animate-pulse">
      {/* Cover picture skeleton */}
      <div className="w-full h-48 bg-neutral-200 dark:bg-neutral-800 rounded-xl mb-4" />
      
      {/* Category badglet skeleton */}
      <div className="w-16 h-5 bg-neutral-200 dark:bg-neutral-800 rounded-full mb-3" />
      
      {/* Title block skeleton */}
      <div className="w-3/4 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-2" />
      <div className="w-1/2 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4" />
      
      {/* Excerpt skeleton */}
      <div className="w-full h-4 bg-neutral-100 dark:bg-neutral-800/80 rounded-md mb-2" />
      <div className="w-5/6 h-4 bg-neutral-100 dark:bg-neutral-800/80 rounded-md mb-5" />
      
      {/* Author and metadata footer skeleton */}
      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-neutral-50 dark:border-neutral-800">
        <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="w-24 h-3 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="w-16 h-3 bg-neutral-100 dark:bg-neutral-800/80 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  const items = Array.from({ length: count });
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
