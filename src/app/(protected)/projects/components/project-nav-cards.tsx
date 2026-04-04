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
  description: string;
}

function NavCard({
  title,
  href,
  icon: Icon,
  description,
}: NavCardProps) {
  return (
    <Link href={href} className="group flex-1 sm:min-w-[200px]">
      <div className="glass-card h-full bg-white hover:bg-zinc-50 border border-gray-200/80 rounded-4xl p-5 transition-all duration-300 //shadow-sm //hover:shadow-md flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div
            className={`p-2.5 rounded-full bg-primary-100/50 //text-primary border-primary-200 border text-opacity-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:text-white group-hover:bg-primary`}
          >
            <Icon className="size-6" />
          </div>
          <div className="size-8 rounded-full flex items-center justify-center  transition-all group-hover:translate-x-1 ">
            <ChevronRight className="size-4 text-zinc-400 group-hover:text-black hidden sm:block" />
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
      description: "Управление планом работ",
    },
    {
      title: "Спецификации",
      href: `/projects/${projectId}/specifications`,
      icon: FileSpreadsheet,
      description: "Материалы и оборудование",
    },
    {
      title: "Медиа",
      href: `/projects/${projectId}/media`,
      icon: Images,
      description: "Фото, рендеры и чертежи",
    },
    {
      title: "Команда",
      href: `/projects/${projectId}/team`,
      icon: Users,
      description: "Участники и роли",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full">
      {cards.map((card) => (
        <NavCard key={card.title} {...card} />
      ))}
    </div>
  );
}
