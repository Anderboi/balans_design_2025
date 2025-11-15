// Типы для проектов
export interface Project {
  id: string;
  name: string;
  address: string;
  area: number;
  client_id: string | null;
  residents: string;
  demolition_info: string;
  construction_info: string;
  rooms: Room[];
  stage: ProjectStage;
  created_at: string;
  updated_at: string;
  contacts: Contact[];
}

export enum ProjectStage {
  PREPROJECT = "Предпроектная",
  CONCEPT = "Концепция",
  WORKING = "Рабочая",
  SUPERVISION = "Авторский контроль",
  COMPLETION = "Комплектация",
}

export interface Room {
  id: string;
  name: string;
  area: number;
  preferred_finishes: string;
  furniture_equipment: string[];
}

// Типы для задач
export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  due_date: string;
  assigned_to: string;
  created_at: string;
  updated_at: string;
}

export enum TaskStatus {
  TODO = "К выполнению",
  IN_PROGRESS = "В процессе",
  REVIEW = "На проверке",
  DONE = "Выполнено",
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

// Типы для материалов и спецификаций
export interface Material {
  id: string;
  name: string;
  description?: string;
  manufacturer?: string;
  article?: string;
  lead_time?: number;
  product_url?: string;
  size?: string;
  color?: string;
  finish?: string;
  material?: string;
  //category?: string;
  type: MaterialType;
  supplier?: string;
  price?: number;
  unit?: string;
  image_url?: string;
  in_stock?: boolean;
  tags?: string[];
  created_at?: string;
  updated_at?: string;
}

export enum MaterialType {
  FINISH = "Отделка",
  FURNITURE = "Мебель",
  EQUIPMENT = "Оборудование",
  BATHROOM = "Сантехника",
  LIGHTING = "Освещение",
  TEXTILE = "Текстиль",
  FIXTURES = "Инженерное оборудование",
  DECOR = "Декор",
  DOORS = "Двери",
  ELECTRIC = "Электрика",
}

// export interface Specification {
//   id: string;
//   project_id: string;
//   material_id: string;
//   quantity: number;
//   room_id: string;
//   notes: string;
//   created_at: string;
//   updated_at: string;
//   rooms: Room[];
//   materials: Material[];
// }

// Типы для контактов
export interface Contact {
  id: string;
  name: string;
  type: ContactType;
  company_id?: string; // ID компании, если контакт является представителем
  position: string;

  phone: string;
  email: string;
  address: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  website: string;
  email: string;
  phone: string;
  address: string;
  tags: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export enum ContactType {
  CLIENT = "Клиент",
  SUPPLIER = "Поставщик",
}

export enum CompanyType {
  CLIENT = "Клиент",
  SUPPLIER = "Поставщик",
}
