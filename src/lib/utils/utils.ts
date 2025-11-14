import { ProjectStage } from '@/types';
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function getStageBadgeClass(stage: ProjectStage): string {
  switch (stage) {
    case ProjectStage.PREPROJECT:
      return "bg-gray-100 border-gray-300 text-gray-700"; // Light gray for pre-project
    case ProjectStage.CONCEPT:
      return "bg-blue-100 border-blue-300 text-blue-700"; // Light blue for concept
    case ProjectStage.WORKING:
      return "bg-indigo-100 border-indigo-300 text-indigo-700"; // Indigo for working stage
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
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
