import { projectsService } from "@/lib/services/projects";
import RoomsBlock from "./rooms-block";
import { createClient } from "@/lib/supabase/server";

export default async function RoomsBlockLoader({ id }: { id: string }) {
  const supabase = await createClient();
  const rooms = await projectsService.getRooms(id, supabase);
  return <RoomsBlock id={id} rooms={rooms} />;
}
