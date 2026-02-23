import { SupabaseClient } from "@supabase/supabase-js";
import { DrawingFile, DrawingAnnotation } from "@/types/drawings";

const BUCKET_NAME = "drawing_files";

export const drawingSetsService = {
  // ─── Drawing Files CRUD ─────────────────────────────────────

  async getDrawingSets(
    projectId: string,
    client: SupabaseClient,
  ): Promise<DrawingFile[]> {
    const { data, error } = await client
      .from("drawing_sets")
      .select("*")
      .eq("project_id", projectId)
      .order("category", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching drawing sets:", error);
      throw error;
    }

    return data || [];
  },

  async createDrawingSet(
    drawing: Omit<DrawingFile, "id" | "created_at" | "updated_at">,
    client: SupabaseClient,
  ): Promise<DrawingFile> {
    const { data, error } = await client
      .from("drawing_sets")
      .insert({
        project_id: drawing.project_id,
        title: drawing.title,
        description: drawing.description || null,
        category: drawing.category,
        file_url: drawing.file_url,
        file_size: drawing.file_size,
        file_name: drawing.file_name,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating drawing set:", error);
      throw error;
    }

    return data;
  },

  async deleteDrawingSet(
    drawingId: string,
    fileUrl: string,
    client: SupabaseClient,
  ): Promise<void> {
    const { error: dbError } = await client
      .from("drawing_sets")
      .delete()
      .eq("id", drawingId);

    if (dbError) {
      console.error("Error deleting drawing set:", dbError);
      throw dbError;
    }

    try {
      const urlParts = fileUrl.split(`${BUCKET_NAME}/`);
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await client.storage.from(BUCKET_NAME).remove([filePath]);
      }
    } catch (e) {
      console.warn("Error deleting file from storage:", e);
    }
  },

  async updateDrawingSet(
    drawingId: string,
    updates: Partial<Pick<DrawingFile, "title" | "description" | "category">>,
    client: SupabaseClient,
  ): Promise<DrawingFile> {
    const { data, error } = await client
      .from("drawing_sets")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", drawingId)
      .select()
      .single();

    if (error) {
      console.error("Error updating drawing set:", error);
      throw error;
    }

    return data;
  },

  // ─── File Upload ────────────────────────────────────────────

  async uploadFile(
    file: File,
    directory: string,
    client: SupabaseClient,
  ): Promise<{ path: string; fullUrl: string }> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${directory}/${fileName}`;

    const { error: uploadError } = await client.storage
      .from(BUCKET_NAME)
      .upload(filePath, file);

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      throw uploadError;
    }

    const { data } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return {
      path: filePath,
      fullUrl: data.publicUrl,
    };
  },

  // ─── Annotations CRUD ──────────────────────────────────────

  async getAnnotations(
    drawingId: string,
    client: SupabaseClient,
  ): Promise<DrawingAnnotation[]> {
    const { data, error } = await client
      .from("drawing_annotations")
      .select("*")
      .eq("drawing_id", drawingId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching annotations:", error);
      throw error;
    }

    return data || [];
  },

  async createAnnotation(
    annotation: Omit<DrawingAnnotation, "id" | "created_at" | "updated_at">,
    client: SupabaseClient,
  ): Promise<DrawingAnnotation> {
    const { data, error } = await client
      .from("drawing_annotations")
      .insert(annotation)
      .select()
      .single();

    if (error) {
      console.error("Error creating annotation:", error);
      throw error;
    }

    return data;
  },

  async updateAnnotation(
    annotationId: string,
    updates: Partial<Pick<DrawingAnnotation, "content" | "resolved" | "color">>,
    client: SupabaseClient,
  ): Promise<DrawingAnnotation> {
    const { data, error } = await client
      .from("drawing_annotations")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", annotationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating annotation:", error);
      throw error;
    }

    return data;
  },

  async deleteAnnotation(
    annotationId: string,
    client: SupabaseClient,
  ): Promise<void> {
    const { error } = await client
      .from("drawing_annotations")
      .delete()
      .eq("id", annotationId);

    if (error) {
      console.error("Error deleting annotation:", error);
      throw error;
    }
  },
};
