"use client";

import {
  FileText,
  Users,
  LayoutGrid,
  Hammer,
  Paintbrush,
  Package,
  Zap,
  Home,
} from "lucide-react";
import { BriefSectionCard } from "./brief-section-card";

const sections = [
  {
    id: "general",
    title: "Общая информация",
    description: "Адрес, площадь, сроки и контакты.",
    icon: FileText,
  },
  {
    id: "residents",
    title: "Проживающие",
    description: "Состав семьи, дети, питомцы и образ жизни.",
    icon: Users,
  },
  {
    id: "rooms",
    title: "Состав помещений",
    description: "Список комнат и их назначение.",
    icon: LayoutGrid,
  },
  {
    id: "demolition",
    title: "Демонтаж",
    description: "Перепланировка, замена окон и дверей.",
    icon: Hammer,
  },
  {
    id: "construction",
    title: "Информация по монтажу",
    description: "Отделка стен, потолка и пола по помещениям.",
    icon: Paintbrush,
  },
  {
    id: "furnishing",
    title: "Наполнение помещений",
    description: "Мебель, сантехника и оборудование по комнатам.",
    icon: Package,
  },
  {
    id: "engineering",
    title: "Инженерные системы",
    description: "Вентиляция, умный дом, электрика.",
    icon: Zap,
  },
  {
    id: "style",
    title: "Стилевые предпочтения",
    description: "Любимые цвета, материалы и референсы.",
    icon: Home,
  },
];

import { useParams } from "next/navigation";
import Link from "next/link";

export function BriefSectionsGrid() {
  const params = useParams();
  const projectId = params.id as string;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sections.map((section) => (
        <Link
          href={`/projects/${projectId}/brief/${section.id}`}
          key={section.id}
        >
          <BriefSectionCard
            title={section.title}
            description={section.description}
            icon={section.icon}
          />
        </Link>
      ))}
    </div>
  );
}
