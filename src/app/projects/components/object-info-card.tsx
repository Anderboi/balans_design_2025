import Link from "next/link";
import { Building, ChevronRight, MapPin } from "lucide-react";

interface ObjectInfoCardProps {
  projectId: string;
  address: string | null;
  area?: number | null;
}

export function ObjectInfoCard({
  projectId,
  address,
  area,
}: ObjectInfoCardProps) {
  return (
    <Link href={`/projects/${projectId}/object-info`} className="block">
      <div className="bg-linear-to-br from-[#f8f9fc] to-white hover:from-indigo-50/80 hover:to-white border border-gray-200/80 rounded-[24px] p-6 shadow-sm transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between items-start w-full">
        {/* Decorative circle */}
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-100/40 rounded-full blur-3xl group-hover:bg-indigo-200/50 transition-colors" />

        <div className="flex items-center gap-5 w-full relative z-10">
          <div className="size-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <Building className="size-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-900 transition-colors truncate">
              Информация по объекту
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1.5">
              <span className="flex items-center gap-1.5 truncate">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">{address || "Адрес не указан"}</span>
              </span>
              {area && area > 0 && (
                <span className="flex items-center gap-1.5 shrink-0">
                  <span className="size-1 bg-gray-300 rounded-full" />
                  {area} м²
                </span>
              )}
            </div>
          </div>
          <div className="size-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all shrink-0">
            <ChevronRight className="size-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
          </div>
        </div>
      </div>
    </Link>
  );
}
