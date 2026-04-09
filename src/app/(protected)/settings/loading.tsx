import MainBlockCard from "@/components/ui/main-block-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <MainBlockCard className="space-y-6 p-8 md:p-12">
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3 rounded-2xl" />
        <Skeleton className="h-4 w-1/2 rounded-2xl opacity-50" />
      </div>
      <div className="space-y-6 mt-8">
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-2xl" />
      </div>
    </MainBlockCard>
  );
}
