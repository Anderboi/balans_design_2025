// Типы для вариантов коллажей/мудбордов

export interface CollageVariant {
  id: string;
  project_id: string;
  room_id: string;
  title: string;
  description?: string;
  image_url: string;
  file_url: string;
  file_size: number;
  file_name: string;
  approved: boolean;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
}
