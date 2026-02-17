export interface CollageImage {
  id: string;
  url: string;
  name: string;
  size: number;
  type?: string;
}

export interface CollageVariant {
  id: string;
  project_id: string;
  room_id: string;
  title: string;
  description?: string;
  images: CollageImage[];
  approved: boolean;
  approved_at: string | null;
  created_at: string;
  updated_at: string;

  // Keeping these for transition
  image_url?: string;
  file_url?: string;
  file_size?: number;
  file_name?: string;
}
