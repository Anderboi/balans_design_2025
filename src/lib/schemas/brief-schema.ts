import { z } from "zod";

// ? Общие данные
export const CommonDataSchema = z.object({
  clientName: z.string().min(1, "Напишите имя клиента"),
  clientSurname: z.string().min(1, "Напишите фамилию клиента"),
  email: z
    .string()
    .email("Напишите email куда будет приходить информация по проекту"),
  phone: z.string().optional(),
  address: z.string().min(1, "Введите адрес"),
  area: z.number().min(1, "Введите площадь"),
  contractNumber: z.string().optional(),
  startDate: z.string().date().optional(),
  finalDate: z.string().date().optional(),
});
export type CommonFormValues = z.infer<typeof CommonDataSchema>;

// ? Типы помещений
export const RoomTypeEnum = z.enum(["living", "utility", "wet", "technical"]);
export type RoomType = z.infer<typeof RoomTypeEnum>;

// ? Оборудование
export const EquipmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string().url("Введите корректный URL").optional().or(z.literal("")),
  price: z
    .number()
    .nonnegative("Стоимость должна быть положительным числом")
    .optional(),
  manufacturer: z.string().optional(),
  description: z.string().optional(),
  quantity: z
    .number()
    .positive("Количество должно быть больше нуля")
    .optional(),
  room_id: z.string(), // Изменено с .uuid() на просто .string()
  category: z.string().optional(),
  isCustom: z.boolean().optional(),
});
export type Equipment = z.infer<typeof EquipmentSchema>;

// ? Помещение
export const PremiseSchema = z.object({
  name: z.string().min(1, "Необходимо указать название"),
  order: z.number(),
  area: z.number().optional(),
  type: RoomTypeEnum.optional(),
  equipment: z.array(EquipmentSchema).optional(),
});
export type Premise = z.infer<typeof PremiseSchema>;

// ? Помещения
export const PremisesSchema = z.object({
  rooms: z.array(PremiseSchema).min(1, "Добавьте хотя бы одно помещение"),
});
export type PremisesFormValues = z.infer<typeof PremisesSchema>;

// Схема для блока наполнения помещений
export const EquipmentBlockSchema = z.object({
  rooms: z.array(
    z.object({
      room_id: z.string(),
      room_name: z.string(),
      equipment: z.array(EquipmentSchema),
    }),
  ),
});
export type EquipmentBlockFormValues = z.infer<typeof EquipmentBlockSchema>;

// Справочник оборудования по типам помещений
export const equipmentTemplates = {
  kitchen: [
    { name: "Холодильник", category: "Бытовая техника" },
    { name: "Варочная поверхность", category: "Бытовая техника" },
    { name: "Духовка", category: "Бытовая техника" },
    { name: "Посудомоечная машина", category: "Бытовая техника" },
    { name: "Вытяжка", category: "Бытовая техника" },
    { name: "СВЧ", category: "Бытовая техника" },
    { name: "Измельчитель", category: "Бытовая техника" },
    { name: "Раковина", category: "Сантехника" },
    { name: "Фильтр воды", category: "Сантехника" },
  ],
  bathroom: [
    { name: "Раковина", category: "Сантехника" },
    { name: "Унитаз", category: "Сантехника" },
    { name: "Гигиенический душ", category: "Сантехника" },
    { name: "Биде", category: "Сантехника" },
    { name: "Ванна", category: "Сантехника" },
    { name: "Душ", category: "Сантехника" },
    { name: "Полотенцесушитель", category: "Сантехника" },
    { name: "Стиральная машина", category: "Бытовая техника" },
    { name: "Сушильная машина", category: "Бытовая техника" },
    { name: "Бойлер", category: "Бытовая техника" },
  ],
  living: [
    { name: "Телевизор", category: "Электроника" },
    { name: "Диван", category: "Мебель" },
    { name: "Кресло", category: "Мебель" },
    { name: "Обеденный стол", category: "Мебель" },
    { name: "Журнальный стол", category: "Мебель" },
  ],
  bedroom: [
    { name: "Кровать", category: "Мебель" },
    { name: "Прикроватная тумба", category: "Мебель" },
    { name: "Шкаф", category: "Мебель" },
    { name: "Телевизор", category: "Электроника" },
  ],
  default: [
    { name: "Шкаф", category: "Мебель" },
    { name: "Комод", category: "Мебель" },
    { name: "Стиральная машина", category: "Бытовая техника" },
    { name: "Сушильная машина", category: "Бытовая техника" },
  ],
};

// Тип для кэша
type EquipmentSuggestionsCache = Map<
  string,
  (typeof equipmentTemplates)[keyof typeof equipmentTemplates]
>;

// Интерфейс для расширения функции
interface GetMemoizedEquipmentSuggestions {
  (
    roomName: string,
    roomType?: RoomType,
  ): (typeof equipmentTemplates)[keyof typeof equipmentTemplates];
  cache: EquipmentSuggestionsCache;
}

// Функция для получения предложений оборудования
export const getEquipmentSuggestions = (
  roomName: string,
  roomType?: RoomType,
) => {
  const name = roomName.toLowerCase();

  // Проверка по типу помещения (приоритет)
  if (roomType === "wet") {
    // Различаем кухню и санузел по названию
    if (name.includes("кухн")) return equipmentTemplates.kitchen;
    return equipmentTemplates.bathroom;
  }
  if (roomType === "living") {
    if (name.includes("спальн")) return equipmentTemplates.bedroom;
    return equipmentTemplates.living;
  }
  if (roomType === "utility") return equipmentTemplates.default;
  if (roomType === "technical") return equipmentTemplates.default;

  // Проверка по названию помещения (если тип не указан)
  if (name.includes("кухн")) return equipmentTemplates.kitchen;
  if (
    name.includes("ванн") ||
    name.includes("санузел") ||
    name.includes("с/у") ||
    name.includes("сан")
  )
    return equipmentTemplates.bathroom;
  if (
    name.includes("гостин") ||
    name.includes("зал") ||
    name.includes("кабинет")
  )
    return equipmentTemplates.living;
  if (name.includes("спальн") || name.includes("детск"))
    return equipmentTemplates.bedroom;
  return equipmentTemplates.default;
};

// Мемоизированная версия функции для получения предложений оборудования
export const getMemoizedEquipmentSuggestions: GetMemoizedEquipmentSuggestions =
  (
    roomName: string,
    roomType?: RoomType,
  ): (typeof equipmentTemplates)[keyof typeof equipmentTemplates] => {
    // Создаем уникальный ключ для кэширования
    const cacheKey = `${roomName}_${roomType || "undefined"}`;

    // Простой кэш в памяти
    if (!getMemoizedEquipmentSuggestions.cache) {
      getMemoizedEquipmentSuggestions.cache =
        new Map() as EquipmentSuggestionsCache;
    }

    const cachedResult = getMemoizedEquipmentSuggestions.cache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const result = getEquipmentSuggestions(roomName, roomType);
    getMemoizedEquipmentSuggestions.cache.set(cacheKey, result);

    return result;
  };

// Инициализируем кэш
getMemoizedEquipmentSuggestions.cache = new Map() as EquipmentSuggestionsCache;

// Сброс кэша при необходимости
export const clearEquipmentSuggestionsCache = () => {
  if (getMemoizedEquipmentSuggestions.cache) {
    getMemoizedEquipmentSuggestions.cache.clear();
  }
};

// ? Резиденты
export const ResidentsSchema = z.object({
  adults: z
    .array(
      z.object({
        height: z
          .number({ message: "Введите рост числом" })
          .positive("Рост должен быть положительным")
          .lte(250, "Рост не может быть больше 250 см"),
        gender: z.string(),
      }),
    )
    .min(1, "Должен быть хотя бы один взрослый"),
  children: z.array(
    z.object({
      age: z
        .number({ message: "Введите возраст числом" })
        .positive("Возраст должен быть положительным")
        .lte(18, "Возраст должен быть меньше 18 лет"),
    }),
  ),
  hobbies: z.string().optional(),
  healthIssues: z.string().optional(),
  hasPets: z.boolean(),
  petDetails: z.string().optional(),
});
export type ResidentsFormValues = z.infer<typeof ResidentsSchema>;

// ? Монтаж
const MaterialItemSchema = z.object({
  type: z.string(),
  material: z.string(),
  rooms: z.array(z.string()),
});

export const ConstructionInfoSchema = z.object({
  floor: z.array(MaterialItemSchema).optional(),
  ceiling: z.array(MaterialItemSchema).optional(),
  walls: z.array(MaterialItemSchema).optional(),
});
export type ConstructionFormValues = z.infer<typeof ConstructionInfoSchema>;

// ? Демонтаж
export const DemolitionSchema = z.object({
  projectId: z.string().optional(),
  planChange: z.boolean().optional(),
  planChangeInfo: z.string().optional(),
  entranceDoorChange: z.boolean().optional(),
  enteranceDoorType: z.string().optional(),
  windowsChange: z.boolean().optional(),
  windowsType: z.string().optional(),
  furnitureDemolition: z.boolean().optional(),
  furnitureToDemolish: z.string().optional(),
});
export type DemolitionType = z.infer<typeof DemolitionSchema>;

// ? Инженерные Системы

const EngineeringSystemItemSchema = z.object({
  id: z.union([z.number(), z.string()]).optional(),
  system: z.string().optional(),
  rooms: z.array(z.string()).optional(),
});

export const EngineeringSystemsSchema = z.object({
  heatingSystem: z.array(EngineeringSystemItemSchema).optional(),
  warmFloorRooms: z.array(EngineeringSystemItemSchema).optional(),
  conditioningSystem: z.array(EngineeringSystemItemSchema).optional(),
  purificationSystem: z.array(EngineeringSystemItemSchema).optional(),
  electricSystem: z.array(EngineeringSystemItemSchema).optional(),
});
export type EngineeringSystemsType = z.infer<typeof EngineeringSystemsSchema>;

export type SystemType =
  | "heating"
  | "conditioning"
  | "purification"
  | "electric";

export type SystemRecord = {
  project_id: string;
  system: string;
  type: SystemType;
  rooms: string[];
};

// ? Стиль
export const StyleSchema = z.object({
  preferences: z.string().optional(),
  pinterestLink: z
    .string()
    .url("Введите корректный URL")
    .optional()
    .or(z.literal("")),
});
export type StyleFormValues = z.infer<typeof StyleSchema>;

// ? Location & Logistics
export const LocationLogisticsSchema = z.object({
  floor: z.number().optional(),
  entrance: z.number().optional(),
  code: z.string().optional(),
  passengerLift: z
    .object({
      width: z.number().optional(),
      depth: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
  freightLift: z
    .object({
      width: z.number().optional(),
      depth: z.number().optional(),
      height: z.number().optional(),
    })
    .optional(),
  logisticsRules: z.string().optional(),
});
export type LocationLogisticsFormValues = z.infer<
  typeof LocationLogisticsSchema
>;

// ? Technical Conditions
export const TechnicalConditionsSchema = z.object({
  voltageCapacity: z.string().optional(),
  coolingCapacity: z.string().optional(),
  recommendations: z.string().optional(),
  attachments: z.array(z.string()).optional(),
});
export type TechnicalConditionsFormValues = z.infer<
  typeof TechnicalConditionsSchema
>;

// ? Responsible Person
export const ResponsiblePersonSchema = z.object({
  fullName: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
});
export type ResponsiblePersonFormValues = z.infer<
  typeof ResponsiblePersonSchema
>;
