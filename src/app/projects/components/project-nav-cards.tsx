"use client";

import Link from "next/link";
import {
  SquareKanban,
  FileSpreadsheet,
  Images,
  Users,
  ChevronRight,
  LucideIcon,
} from "lucide-react";

interface NavCardProps {
  title: string;
  href: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

function NavCard({
  title,
  href,
  icon: Icon,
  color,
  description,
}: NavCardProps) {
  return (
    <Link href={href} className="group flex-1 min-w-[200px]">
      <div className="h-full bg-white hover:bg-zinc-50 border border-gray-200/80 rounded-[20px] p-5 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div
            className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-opacity-100 flex items-center justify-center`}
          >
            <Icon className="size-5" />
          </div>
          <div className="size-8 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
            <ChevronRight className="size-4 text-zinc-400 group-hover:text-black" />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-zinc-900 group-hover:text-black transition-colors">
            {title}
          </h4>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-1">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}

export function ProjectNavCards({ projectId }: { projectId: string }) {
  const cards = [
    {
      title: "Задачи",
      href: `/projects/${projectId}/tasks`,
      icon: SquareKanban,
      color: "bg-blue-500 text-blue-600",
      description: "Управление планом работ",
    },
    {
      title: "Спецификации",
      href: `/projects/${projectId}/specifications`,
      icon: FileSpreadsheet,
      color: "bg-emerald-500 text-emerald-600",
      description: "Материалы и оборудование",
    },
    {
      title: "Медиа",
      href: `/projects/${projectId}/media`,
      icon: Images,
      color: "bg-purple-500 text-purple-600",
      description: "Фото, рендеры и чертежи",
    },
    {
      title: "Команда",
      href: `/projects/${projectId}/team`,
      icon: Users,
      color: "bg-orange-500 text-orange-600",
      description: "Участники и роли",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card) => (
        <NavCard key={card.title} {...card} />
      ))}
    </div>
  );
}
