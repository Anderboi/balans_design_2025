import { materialsService } from "@/lib/services/materials";
import BlockHeader from "./block-header";
import MaterialListControls from "./material-list-controls";
import { createClient } from "@/lib/supabase/server";

const SchedulesBlock = async ({ id }: { id: string }) => {
  const supabase = await createClient();
  const materials = await materialsService.getSpecifications(id, supabase);
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
