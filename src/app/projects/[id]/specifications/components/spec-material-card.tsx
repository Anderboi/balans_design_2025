import Image from "next/image";
import { Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import MaterialData from "./material-data";

const SpecMaterialCard = ({ material }: { material: any }) => {
  return (
    <div className="bg-white w-full p-2 rounded-lg flex gap-2">
      {material.image_url ? (
        <Image
          src={""}
          alt="product_image"
          className="bg-neutral-200 rounded-md"
          height={120}
          width={120}
        />
      ) : (
        <span className="w-[140px] h-[120px] bg-muted rounded-sm flex items-center justify-center">
          <Package className="w-8 h-8 text-muted-foreground" />
        </span>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 w-full gap-4">
        <div className="flex flex-col justify-between h-full">
          <MaterialData label="Наименование" value={material.name} />

          <Input
            className="placeholder:text-muted-foreground/40"
            placeholder="Марка"
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          <MaterialData label="название продукта" value={material.name} />
          <MaterialData label="производитель" value={material.name} />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex w-full grow justify-between">
            <MaterialData label="ш (мм)" value={material.name} />
            <MaterialData label="д (мм)" value={material.name} />
          </div>
          <MaterialData label="цвет" value={material.name} />
        </div>
      </div>
    </div>
  );
};

export default SpecMaterialCard;
