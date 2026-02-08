import { FileText } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type StageStatus = "completed" | "in_progress" | "locked";

export interface StageSubItem {
  id: string;
  title: string;
  completed: boolean;
  icon?: LucideIcon;
}

export interface StageConfig {
  id: string;
  title: string;
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
    defaultStatus: "completed",
    items: [
      // {
      //   id: "documents",
      //   title: "Документы",
      //   completed: true,
      //   icon: FileText,
      // },
      {
        id: "brief",
        title: "Техническое задание",
        completed: true,
        icon: FileText,
      },
      {
        id: "object_info",
        title: "Информация по объекту",
        completed: true,
        icon: FileText,
      },
    ],
  },
  {
    id: "concept",
    title: "Концепция",
    defaultStatus: "in_progress",
    dueDate: "15.11.2023",
    progress: { current: 2, total: 3 },
    items: [
      {
        id: "planning",
        title: "Планировочные решения",
        completed: true,
        icon: FileText,
      },
      {
        id: "collages",
        title: "Коллажи / Мудборды",
        completed: true,
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
    defaultStatus: "locked",
    items: [
      { id: "drawings", title: "Чертежи", completed: false, icon: FileText },
      { id: "specs", title: "Спецификации", completed: false, icon: FileText },
    ],
  },
  {
    id: "realization",
    title: "Реализация",
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
