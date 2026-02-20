// Типы для вариантов планировки

export interface PlanningVariantImage {
  id: string;
  url: string;
  name: string;
  size: number;
  downloadUrl?: string;
}

export interface PlanningVariant {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  images: PlanningVariantImage[]; // Supporting multiple files/images
  image_url: string;
  file_url: string;
  file_size: number;
  file_name: string;
  approved: boolean;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}
