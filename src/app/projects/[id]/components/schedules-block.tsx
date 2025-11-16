import { materialsService } from "@/lib/services/materials";
import BlockHeader from "./block-header";
import { Material, MaterialType, SpecificationMaterial } from "@/types";
import Link from "next/link";
import SpecMaterialCard from "../specifications/components/spec-material-card";
import { Suspense } from "react";

const SchedulesBlock = async ({ id }: { id: string }) => {
  const schedules = Object.values(MaterialType);

  const materials = await materialsService.getSpecifications(id);
  console.log(materials);
  return (
    <>
      <BlockHeader
        title="Спецификации"
        href=""
        buttontext="Создать спецификацию"
      />

      <article>
        <div className="flex flex-col gap-2">
          <Suspense fallback={<div>Loading...</div>}>
            {materials &&
              materials.map(
                (material: SpecificationMaterial, index: number) => (
                  <SpecMaterialCard key={index} material={material} />
                )
              )}
          </Suspense>
          {/* {schedules.map((category: string, key: number) => (
            <Link
              className="py-2 /border-b"
              href={`/projects/${id}/specifications?schedule=${category}`}
              key={category}
            >
              {category}
            </Link>
          ))} */}
        </div>
      </article>
    </>
  );
};

export default SchedulesBlock;
