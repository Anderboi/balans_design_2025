import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Информация о проекте */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>

      {/* Табы */}
      <div className="flex space-x-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-32" />
        ))}
      </div>

      {/* Контент */}
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
