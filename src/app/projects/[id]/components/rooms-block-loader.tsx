import { projectsService } from "@/lib/services/projects";
import RoomsBlock from "./rooms-block";

export default async function RoomsBlockLoader({ id }: { id: string }) {
  const rooms = await projectsService.getRooms(id);
  return <RoomsBlock id={id} rooms={rooms} />;
}
