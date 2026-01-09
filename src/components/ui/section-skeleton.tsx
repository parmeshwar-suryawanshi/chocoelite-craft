import { Skeleton } from "@/components/ui/skeleton";

interface SectionSkeletonProps {
  variant?: 'cards' | 'gallery' | 'banner' | 'list' | 'video';
  count?: number;
  className?: string;
}

export function SectionSkeleton({ variant = 'cards', count = 3, className = '' }: SectionSkeletonProps) {
  if (variant === 'banner') {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-96 max-w-full mx-auto" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (variant === 'video') {
    return (
      <div className={`space-y-4 ${className}`}>
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-64 mx-auto" />
        <Skeleton className="aspect-video w-full max-w-4xl mx-auto rounded-xl" />
      </div>
    );
  }

  if (variant === 'gallery') {
    return (
      <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 items-center">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default: cards
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(count, 4)} gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-8 w-24" />
        </div>
      ))}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-4 p-4 rounded-lg border bg-card">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  );
}

export function OfferCardSkeleton() {
  return (
    <div className="p-6 rounded-xl border bg-card space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-xl border bg-card space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
