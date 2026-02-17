export interface VisualizationImage {
  id: string;
  url: string;
  name: string;
  size: number;
  type?: string;
}

export interface VisualizationVariant {
  id: string;
  project_id: string;
  room_id: string;
  title: string;
  description: string | null;
  images: VisualizationImage[];
  approved: boolean;
  approved_at: string | null;
  created_at: string;
  updated_at: string;

  // Keeping these for potential backward compatibility during transition if needed
  image_url?: string;
  file_url?: string;
  file_size?: number;
  file_name?: string;
}
