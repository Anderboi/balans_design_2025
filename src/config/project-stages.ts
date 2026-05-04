import {
  FileText,
  ClipboardList,
  Sparkles,
  PencilRuler,
  Hammer,
  LucideIcon,
  Ruler,
} from "lucide-react";

export type StageStatus = "completed" | "in_progress" | "ready" | "locked";

export interface StageSubItem {
  id: string;
  title: string;
  completed: boolean;
  icon?: LucideIcon;
}

export interface StageConfig {
  id: string;
  title: string;
  icon?: LucideIcon;
  defaultStatus: StageStatus; // Changed from status to defaultStatus as status will come from DB eventually
  dueDate?: string;
  progress?: {
    current: number;
    total: number;
  };
  items: StageSubItem[];
}

export const STAGES_CONFIG: StageConfig[] = [
  {
    id: "preproject",
    title: "Предпроектная",
    icon: ClipboardList,
    defaultStatus: "completed",
    items: [
      {
        id: "brief",
        title: "Техническое задание",
        completed: false,
        icon: FileText,
      },
    ],
  },
  {
    id: "concept",
    title: "Концепция",
    icon: Sparkles,
    defaultStatus: "in_progress",
    dueDate: "15.11.2023",
    progress: { current: 2, total: 3 },
    items: [
      {
        id: "planning",
        title: "Планировочные решения",
        completed: false,
        icon: FileText,
      },
      {
        id: "collages",
        title: "Коллажи / Мудборды",
        completed: false,
        icon: FileText,
      },
      {
        id: "viz",
        title: "3D Визуализации",
        completed: false,
        icon: FileText,
      },
    ],
  },
  {
    id: "working",
    title: "Рабочая",
    icon: PencilRuler,
    defaultStatus: "locked",
    items: [
      { id: "drawings", title: "Чертежи", completed: false, icon: Ruler },
      { id: "specs", title: "Спецификации", completed: false, icon: FileText },
    ],
  },
  {
    id: "realization",
    title: "Реализация",
    icon: Hammer,
    defaultStatus: "locked",
    items: [
      {
        id: "supervision",
        title: "Авторский контроль",
        completed: false,
        icon: FileText,
      },
      {
        id: "procurement",
        title: "Комплектация",
        completed: false,
        icon: FileText,
      },
    ],
  },
];
