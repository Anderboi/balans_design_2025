// Типы для проектов
export interface Project {
  id: string;
  name: string;
  address: string | null;
  area?: number;
  client_id: string | null;
  residents?: string; // Optional/missing in DB main table
  demolition_info?: string; // Optional/missing in DB main table
  construction_info?: string; // Optional/missing in DB main table
  rooms?: Room[]; // Optional as it is not always fetched
  stage: string; // Changed from ProjectStage enum to string to match DB
  object_info?: ObjectInfo;
  created_at: string;
  updated_at: string;
  contacts?: Contact | null;
  location?: string | null;
  tags?: string[] | null;
  owner_id?: string | null;
  project_stage_items?: ProjectStageItem[];
}

export interface ProjectStageItem {
  id: string;
  project_id: string;
  stage_id: string;
  item_id: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
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
  order?: number;
  type?: "living" | "wet" | "utility" | "technical";
  furniture_equipment: string[];
  preferred_finishes?: string;
}

// Типы для задач
export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority?: TaskPriority;
  due_date: string;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
  // UI helper fields
  assigneeName?: string;
  observer_ids?: string[];
  observers?: Participant[];
  comments?: Comment[];
  history?: TaskHistoryItem[];
  attachments?: TaskAttachment[];
}

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role?: "executor" | "observer";
}

// User roles for application-level access control
export enum AppRole {
  ADMIN = "admin",
  ARCHITECT = "architect",
  MANAGER = "manager",
  DESIGNER = "designer",
  CLIENT = "client",
  CONTRACTOR = "contractor",
}

export const APP_ROLE_LABELS: Record<AppRole, string> = {
  [AppRole.ADMIN]: "Администратор",
  [AppRole.ARCHITECT]: "Архитектор",
  [AppRole.MANAGER]: "Менеджер",
  [AppRole.DESIGNER]: "Дизайнер",
  [AppRole.CLIENT]: "Клиент",
  [AppRole.CONTRACTOR]: "Подрядчик",
};

export interface Comment {
  id: string;
  userName: string;
  userAvatar?: string;
  text: string;
  createdAt: string;
}

export interface TaskHistoryItem {
  id: string;
  userName: string;
  action: string;
  createdAt: string;
}

export enum TaskPriority {
  LOW = "Низкий",
  MEDIUM = "Средний",
  HIGH = "Высокий",
}

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "К выполнению",
  [TaskStatus.IN_PROGRESS]: "В процессе",
  [TaskStatus.REVIEW]: "На проверке",
  [TaskStatus.DONE]: "Выполнено",
};

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface TaskAttachment {
  id: string;
  task_id: string;
  file_name: string;
  file_url: string;
  file_size?: number;
  file_type?: string;
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
  custom_specifications?: { label: string; value: string }[];
  attachments?: MaterialAttachment[];
  created_at?: string;
  updated_at?: string;
}

export interface MaterialAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
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

export interface SpecificationMaterial {
  id: string;
  project_id: string;
  material_id: string;
  quantity: number;
  room_id?: string[];
  notes: string;
  created_at: string;
  updated_at: string;

  name: string;
  project_article?: string;
  description?: string;
  manufacturer?: string;
  article?: string;
  lead_time?: number;
  product_url?: string;
  size?: string;
  color?: string;
  finish?: string;
  material?: string;
  type: MaterialType;
  supplier?: string;
  price?: number;
  unit?: string;
  image_url?: string;
  in_stock?: boolean;
  tags?: string[];
}

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

// Типы для информации об объекте
export interface RoutePoint {
  floor: number;
  elevator: number;
  area: number;
}

export interface ElevatorEquipment {
  shaftCount: number;
  passengerSpeed: number;
  passengerWeight: number;
  cargoSpeed: number;
  cargoWeight: number;
  cargoHeight: number;
}

export interface TechnicalConditions {
  voltageCapacity: number;
  waterPressure: number;
  heatingType: string;
  recommendations?: string;
}

export interface ResponsiblePerson {
  fullName: string;
  position: string;
  phone: string;
}

export interface DocumentAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  category: "plan_bti" | "instruction" | "cadastral" | "other";
}

export interface PhotoAttachment {
  id: string;
  url: string;
  thumbnailUrl?: string;
}

export interface ObjectInfo {
  // Location and Logistics
  address?: string;
  distance?: string;
  navigationInstructions?: string;
  routePoints?: RoutePoint[];
  loadingSpecs?: string;

  // Elevator Equipment
  elevatorEquipment?: ElevatorEquipment;

  // Technical Conditions
  technicalConditions?: TechnicalConditions;

  // Responsible Person
  responsiblePerson?: ResponsiblePerson;

  // Documentation
  documents?: DocumentAttachment[];

  // Photos
  photos?: PhotoAttachment[];
}
