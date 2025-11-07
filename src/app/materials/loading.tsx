export function MaterialsLoading() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="h-9 w-64 bg-muted animate-pulse rounded" />
          <div className="h-5 w-96 bg-muted animate-pulse rounded mt-2" />
        </div>
        <div className="h-10 w-40 bg-muted animate-pulse rounded" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="h-10 flex-1 bg-muted animate-pulse rounded" />
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        <div className="h-10 w-48 bg-muted animate-pulse rounded" />
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-muted animate-pulse rounded" />
          <div className="h-10 w-10 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="h-6 w-32 bg-muted animate-pulse rounded-full" />
        <div className="h-6 w-24 bg-muted animate-pulse rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default MaterialsLoading;
