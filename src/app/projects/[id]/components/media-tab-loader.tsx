import { createClient } from "@/lib/supabase/server";
import { visualizationVariantsService } from "@/lib/services/visualization-variants";
import { collageVariantsService } from "@/lib/services/collage-variants";
import { drawingSetsService } from "@/lib/services/drawing-sets";
import { materialsService } from "@/lib/services/materials";
import { roomsService } from "@/lib/services/rooms";
import MediaTab from "./media-tab";
import { MaterialType } from "@/types";

interface MediaTabLoaderProps {
  id: string;
}

export default async function MediaTabLoader({ id }: MediaTabLoaderProps) {
  const supabase = await createClient();

  const [visualizations, collages, drawings, specifications, rooms] =
    await Promise.all([
      visualizationVariantsService.getVisualizationVariants(id, supabase),
      collageVariantsService.getCollageVariants(id, supabase),
      drawingSetsService.getDrawingSets(id, supabase),
      materialsService.getSpecifications(id, supabase),
      roomsService.getRoomsByProjectId(id, supabase),
    ]);

  // Create a map of room IDs to names for quick lookup
  const roomMap = new Map(rooms.map((r) => [r.id, r.name]));

  // Enrichment function to add room name to variants
  const enrichWithRoom = (variant: any) => ({
    ...variant,
    room_name: variant.room_id ? roomMap.get(variant.room_id) : null,
  });

  // Filter for approved items and enrich with room names
  const approvedVisualizations = visualizations
    .filter((v) => v.approved)
    .map(enrichWithRoom);

  const approvedCollages = collages
    .filter((c) => c.approved)
    .map(enrichWithRoom);

  // Filter for equipment materials (tech specs)
  const equipmentSpecs = specifications.filter(
    (spec) => spec.type === MaterialType.EQUIPMENT,
  );

  return (
    <MediaTab
      projectId={id}
      visualizations={approvedVisualizations}
      collages={approvedCollages}
      drawings={drawings}
      equipmentSpecs={equipmentSpecs}
    />
  );
}
