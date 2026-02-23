// Типы для блока "Чертежи" (рабочая документация)

export type DrawingCategory =
  | "demolition" // Демонтаж
  | "montage" // Монтаж
  | "electrical" // Электрика
  | "plumbing" // Сантехника
  | "ceiling" // Потолки
  | "floor" // Полы / покрытия
  | "heating" // Отопление / кондиционирование
  | "furniture" // Мебелировка
  | "general"; // Общие

export interface DrawingCategoryConfig {
  value: DrawingCategory;
  label: string;
  description: string;
}

export const DRAWING_CATEGORIES: DrawingCategoryConfig[] = [
  {
    value: "general",
    label: "Общие",
    description: "Общие чертежи, ведомости и пояснительные записки",
  },
  {
    value: "demolition",
    label: "Демонтаж",
    description: "Демонтажные планы и схемы",
  },
  {
    value: "montage",
    label: "Монтаж",
    description: "Монтажные планы и схемы возведения",
  },
  {
    value: "electrical",
    label: "Электрика",
    description: "Электрические схемы, розетки, освещение",
  },
  {
    value: "plumbing",
    label: "Сантехника",
    description: "Водоснабжение, канализация, оборудование",
  },
  {
    value: "ceiling",
    label: "Потолки",
    description: "Планы потолков и потолочных конструкций",
  },
  {
    value: "floor",
    label: "Полы",
    description: "Планы полов и напольных покрытий",
  },
  {
    value: "heating",
    label: "Отопление / ВК",
    description: "Планы отопления и кондиционирования",
  },
  {
    value: "furniture",
    label: "Мебелировка",
    description: "Планы расстановки мебели",
  },
];

export interface DrawingFile {
  id: string;
  project_id: string;
  title: string;
  description?: string | null;
  category: DrawingCategory;
  file_url: string;
  file_size: number;
  file_name: string;
  image_url?: string | null;
  images?: unknown;
  created_at: string;
  updated_at: string;
}

export interface DrawingAnnotation {
  id: string;
  drawing_id: string;
  page_number: number;
  x_percent: number; // 0-100, % от ширины страницы
  y_percent: number; // 0-100, % от высоты страницы
  content: string;
  author_name?: string | null;
  resolved: boolean;
  color: string;
  created_at: string;
  updated_at: string;
}
