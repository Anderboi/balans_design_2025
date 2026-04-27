// app/(protected)/contacts/loading.tsx
import PageContainer from "@/components/ui/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ContactsLoading() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-10 w-40 rounded-full" />
      </div>

      {/* Search */}
      <Skeleton className="h-12 w-full rounded-2xl" />

      {/* Tabs */}
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20 rounded-full" />
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>

      {/* Companies section */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-28" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-4xl" />
          ))}
        </div>
      </div>

      {/* Contacts section */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-16" />
        <div className="rounded-2xl border border-zinc-100 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3 px-4 border-b border-zinc-100 last:border-0"
            >
              <Skeleton className="size-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-56" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
