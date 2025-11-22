import { materialsService } from "@/lib/services/materials";
import BlockHeader from "./block-header";
import MaterialListControls from "./material-list-controls";

const SchedulesBlock = async ({ id }: { id: string }) => {
  const materials = await materialsService.getSpecifications(id);
  return (
    <>
      <BlockHeader
        title="Спецификации"
        href=""
        buttontext="Создать спецификацию"
      />

      <article className="flex flex-col gap-2">
        <MaterialListControls materials={materials} />
      </article>
    </>
  );
};

export default SchedulesBlock;
