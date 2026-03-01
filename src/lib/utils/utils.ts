import { ProjectStage } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Функция для получения инициалов
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStageBadgeClass(stage: string | ProjectStage): string {
  switch (stage) {
    case ProjectStage.PREPROJECT:
      return "bg-gray-100 border-gray-300 text-gray-700"; // Light gray for pre-project
    case ProjectStage.CONCEPT:
      return "bg-blue-100 border-blue-300 text-blue-700"; // Light blue for concept
    case ProjectStage.WORKING:
      return "bg-red-50 border-red-200 text-red-700"; // Red for working stage
    case ProjectStage.SUPERVISION:
      return "bg-amber-100 border-amber-300 text-amber-700"; // Amber for supervision
    case ProjectStage.COMPLETION:
      return "bg-emerald-100 border-emerald-300 text-emerald-700"; // Emerald for completion
    default:
      return "bg-gray-100 border-gray-300 text-gray-700";
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatPhoneNumber(value: string): string {
  if (!value) return "";

  // Оставляем только цифры
  const digits = value.replace(/\D/g, "");

  // Если первая цифра 7 или 8, убираем её для нормализации
  let number = digits;
  if (number.startsWith("7") || number.startsWith("8")) {
    number = number.substring(1);
  }

  // Ограничиваем 10 цифрами
  number = number.substring(0, 10);

  // Форматируем по маске: +7 (999) 999 99 99
  let result = "+7";

  if (number.length > 0) {
    result += " (" + number.substring(0, 3);
  }

  // Добавляем закрывающую скобку и пробел только если есть 4-я цифра
  if (number.length > 3) {
    result += ") " + number.substring(3, 6);
  }

  // Добавляем пробел только если есть 7-я цифра
  if (number.length > 6) {
    result += " " + number.substring(6, 8);
  }

  // Добавляем пробел только если есть 9-я цифра
  if (number.length > 8) {
    result += " " + number.substring(8, 10);
  }

  return result;
}
