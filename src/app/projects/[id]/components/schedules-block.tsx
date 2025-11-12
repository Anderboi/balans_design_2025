import { Card, CardContent } from '@/components/ui/card';
import { Specification } from '@/types';
import BlockHeader from './block-header';

const SchedulesBlock = ({specifications, id}: {specifications: Specification[], id: string}) => {
  return (
    <>
      <BlockHeader
        href={`/projects/${id}/specifications/new`}
        title="Спецификации"
        buttontext="Добавить спецификацию"
      />

      {specifications.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {specifications.map((spec) => (
            <Card key={spec.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">
                      {/* {spec.materials?.name || "Материал"} */}
                    </h3>
                    <p>
                      <span className="font-medium">Помещение:</span>{" "}
                      {/* {spec.rooms?.name || "Не указано"} */}
                    </p>
                  </div>
                  <div className="text-right">
                    <p>
                      <span className="font-medium">Количество:</span>{" "}
                      {/* {spec.quantity} {spec.unit} */}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Нет добавленных спецификаций</p>
        </div>
      )}
    </>
  );
}

export default SchedulesBlock