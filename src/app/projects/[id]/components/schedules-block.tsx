"use client";

import BlockHeader from "./block-header";
import { MaterialType } from "@/types";
import Link from "next/link";

const SchedulesBlock = ({ id }: { id: string }) => {
  const schedules = Object.values(MaterialType);

  return (
    <>
      
      <BlockHeader
        title="Спецификации"
        href=""
        buttontext="Создать спецификацию"
      />

      <article>
        <div className="flex flex-col">
          {schedules.map((category: string) => (
            <Link
              className="py-2 border-b"
              href={`/projects/${id}/specifications?schedule=${category}`}
              key={category}
            >
              {category}
            </Link>
          ))}
        </div>
      </article>
    </>
  );
};

export default SchedulesBlock;
