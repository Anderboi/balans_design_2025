import { Truck, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { MaterialStatus, MATERIAL_STATUS_LABELS } from "@/types";

// Status priority for sorting (higher = more urgent)
const STATUS_PRIORITY: Record<string, number> = {
  [MaterialStatus.REJECTED]: 5,
  [MaterialStatus.APPROVED]: 4,
  [MaterialStatus.ORDERED]: 3,
  [MaterialStatus.PAID]: 2,
  [MaterialStatus.SELECTED]: 1,
  [MaterialStatus.NOT_SELECTED]: 0,
};

// Apple HIG system colors for status badges
const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  [MaterialStatus.NOT_SELECTED]: {
    bg: "bg-zinc-100",
    text: "text-zinc-500",
    dot: "#8E8E93",
  },
  [MaterialStatus.SELECTED]: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    dot: "#AF52DE",
  },
  [MaterialStatus.REJECTED]: {
    bg: "bg-red-50",
    text: "text-red-500",
    dot: "#FF3B30",
  },
  [MaterialStatus.APPROVED]: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "#FF9F0A",
  },
  [MaterialStatus.ORDERED]: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    dot: "#007AFF",
  },
  [MaterialStatus.PAID]: {
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    dot: "#5856D6",
  },
  [MaterialStatus.DELIVERED]: {
    bg: "bg-green-50",
    text: "text-green-600",
    dot: "#34C759",
  },
};

export async function DeliveryWidget() {
  const supabase = await createClient();

  // Fetch spec materials that are NOT delivered, join with projects
  const { data: materials } = await supabase
    .from("specifications")
    .select("id, name, image_url, status, supplier, expected_delivery_date, projects(name)")
    .not("status", "eq", MaterialStatus.DELIVERED)
    .not("status", "is", null)
    .not("status", "eq", MaterialStatus.NOT_SELECTED)
    .order("updated_at", { ascending: false })
    .limit(20);

  // Sort by priority
  const sorted = (materials ?? []).sort((a, b) => {
    const pA = STATUS_PRIORITY[a.status as string] ?? 0;
    const pB = STATUS_PRIORITY[b.status as string] ?? 0;
    return pB - pA;
  });

  const topItems = sorted.slice(0, 3);
  const activeCount = sorted.length;

  return (
    <div className="flex flex-col h-full bg-white shadow-lg shadow-zinc-200/40 rounded-4xl p-6 border border-zinc-100/50">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 tracking-tight mb-1">
            Статус поставок
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {activeCount > 0
              ? `${activeCount} позиций в работе`
              : "Нет активных поставок"}
          </p>
        </div>
        <Truck className="size-5 text-gray-300" />
      </div>

      <div className="flex-1 flex flex-col">
        {topItems.length > 0 ? (
          <div className="space-y-2">
            {topItems.map((item) => {
              const status = item.status as MaterialStatus;
              const style = STATUS_STYLES[status] ?? STATUS_STYLES[MaterialStatus.NOT_SELECTED];
              const label = MATERIAL_STATUS_LABELS[status] ?? status;
              // @ts-expect-error — projects may be populated from the join
              const projectName = item.projects?.name ?? "";

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50/80 transition-colors cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="size-11 bg-gray-100 rounded-xl overflow-hidden relative shrink-0">
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image_url}
                        alt={item.name ?? ""}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="size-4 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-zinc-900 truncate leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-gray-400 truncate">
                      {[projectName, item.supplier].filter(Boolean).join(" • ")}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="shrink-0">
                    <div
                      className={`text-[10px] font-medium uppercase tracking-wide px-2.5 py-1 rounded-lg ${style.bg} ${style.text}`}
                    >
                      {label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-8 bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
            <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
              <Truck className="h-5 w-5 text-zinc-300" />
            </div>
            <h4 className="text-sm font-medium text-zinc-700 mb-1">
              Все доставлено
            </h4>
            <p className="text-xs text-zinc-400 max-w-[200px] leading-relaxed">
              Нет позиций, требующих внимания
            </p>
          </div>
        )}
      </div>

      {activeCount > 0 && (
        <div className="mt-4 pt-3 border-t border-zinc-100 text-center">
          <Link
            href="/materials"
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors inline-flex items-center gap-1"
          >
            Все поставки <ArrowRight className="size-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
