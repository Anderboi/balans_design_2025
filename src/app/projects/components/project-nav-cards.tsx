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
      <div className="glass-card h-full bg-white hover:bg-zinc-50 border border-gray-200/80 rounded-4xl p-5 transition-all duration-300 //shadow-sm //hover:shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div
            className={`p-2.5 rounded-full ${color} border text-opacity-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="size-6" />
          </div>
          <div className="size-8 rounded-full //bg-zinc-50 flex items-center justify-center //group-hover:bg-white //group-hover:shadow-sm transition-all group-hover:translate-x-1 ">
            <ChevronRight className="size-4 text-zinc-400 group-hover:text-black" />
          </div>
        </div>
        <div>
          <h4 className="text-lg font-bold text-zinc-800 group-hover:text-black transition-colors">
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
      color: "bg-blue-100/50 text-blue-600 border-blue-200",
      description: "Управление планом работ",
    },
    {
      title: "Спецификации",
      href: `/projects/${projectId}/specifications`,
      icon: FileSpreadsheet,
      color: "bg-emerald-100/50 text-emerald-600 border-emerald-200",
      description: "Материалы и оборудование",
    },
    {
      title: "Медиа",
      href: `/projects/${projectId}/media`,
      icon: Images,
      color: "bg-purple-100/50 text-purple-600 border-purple-200",
      description: "Фото, рендеры и чертежи",
    },
    {
      title: "Команда",
      href: `/projects/${projectId}/team`,
      icon: Users,
      color: "bg-orange-100/50 text-orange-600 border-orange-200",
      description: "Участники и роли",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {cards.map((card) => (
        <NavCard key={card.title} {...card} />
      ))}
    </div>
  );
}
