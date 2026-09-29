import { Skeleton } from "./ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-3" aria-live="polite">
      <p className="text-sm text-muted-foreground">
        Watching the video and looking for places…
      </p>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-24 rounded-2xl" />
      ))}
    </div>
  );
}