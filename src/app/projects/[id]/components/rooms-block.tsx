import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Room } from "@/types";
import BlockHeader from "./block-header";

const RoomsBlock = ({ rooms, id }: { rooms: Room[]; id: string }) => {
  return (
    <>
      <BlockHeader
        title="Состав помещений"
        href={`/projects/${id}/rooms/new`}
      />

      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  <span className="font-medium">Площадь:</span> {room.area} м²
                </p>
                <p>
                  <span className="font-medium">Отделка:</span>{" "}
                  {room.preferred_finishes}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Нет добавленных помещений</p>
        </div>
      )}
    </>
  );
};

export default RoomsBlock;
