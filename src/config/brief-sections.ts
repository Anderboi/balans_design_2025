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

export const BRIEF_SECTIONS = [
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
] as const;

export const BRIEF_SECTION_IDS = BRIEF_SECTIONS.map((s) => s.id);
