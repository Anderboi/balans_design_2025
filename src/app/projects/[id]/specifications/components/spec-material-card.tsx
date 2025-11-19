"use client";

import Image from "next/image";
import { Link as LinkIcon, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import MaterialData from "./material-data";
import { SpecificationMaterial } from "@/types";
import { useForm } from "react-hook-form";
import { materialsService } from "@/lib/services/materials";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from 'next/link';

const SpecMaterialCard = ({
  material,
  onUpdate,
}: {
  material: SpecificationMaterial;
  onUpdate?: (updatedMaterial: SpecificationMaterial) => void;
}) => {
  const {
    register,
    watch,
    formState: { isDirty, dirtyFields, isSubmitting },
    reset,
    handleSubmit,
  } = useForm<SpecificationMaterial>({
    defaultValues: {
      name: material.name || "-",
      description: material.description || "-",
      manufacturer: material.manufacturer || "-",
      article: material.article || "-",
      lead_time: material.lead_time || 0,
      product_url: material.product_url || "-",
      size: material.size || "-",
      color: material.color || "-",
      finish: material.finish || "-",
      material: material.material || "-",
      type: material.type,
      supplier: material.supplier || "-",
      price: material.price || 0,
      unit: material.unit || "-",
      image_url: material.image_url || "-",
      quantity: material.quantity || 1,
      notes: material.notes || "",
      project_article: material.project_article || "-",
    },
  });

  const watchQuantity = watch("quantity");
  const watchPrice = watch("price");
  // const totalPrice = watchQuantity * watchPrice;

  // Вычисляем общую стоимость
  const totalPrice = useMemo(() => {
    const quantity = Number(watchQuantity) || 0;
    const price = Number(watchPrice) || 0;
    return quantity * price;
  }, [watchQuantity, watchPrice]);

  // Форматируем число с пробелами для тысяч
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Сохранение конкретного поля при потере фокуса
  const handleFieldBlur = async (
    fieldName: keyof SpecificationMaterial,
    value: any
  ) => {
    // Проверяем, было ли поле изменено
    if (!dirtyFields[fieldName]) return;

    try {
      // Сохраняем только изменённое поле
      const updateData = {
        [fieldName === "type" ? material.type : fieldName]: value,
      };

      await materialsService.updateSpecMaterial(material.id, updateData);

      // Обновляем состояние формы (помечаем как сохранённое)
      reset({}, { keepValues: true });

      if (onUpdate) {
        onUpdate({ ...material, [fieldName]: value });
      }

      // Опционально: показываем уведомление
      toast.success("Изменения сохранены", { duration: 1000 });
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      toast.error("Не удалось сохранить изменения");

      // Возвращаем исходное значение
      reset();
    }
  };

  return (
    <div className="bg-white w-full w-min-[400px] p-1 rounded-lg flex gap-2 border border-muted-foreground/20">
      {material.image_url ? (
        // <Image
        //   src={material.image_url}
        //   alt="product_image"
        //   className="bg-neutral-200 rounded-md"
        //   height={120}
        //   width={120}
        // />
        <img
          src={material.image_url || ""}
          alt={material.name}
          className="size-20 object-cover rounded-sm"
        />
      ) : (
        <span className="w-22 h-20 bg-muted rounded-sm flex items-center justify-center">
          <Package className="w-8 h-8 text-muted-foreground" />
        </span>
      )}
      <div className="grid grid-cols-1 md:grid-cols-5 //lg:grid-cols-5 w-full gap-4">
        <div className="flex flex-col justify-between h-full">
          <MaterialData label="">
            <Textarea
              {...register("name")}
              rows={2}
              className="placeholder:text-muted-foreground/40 max-h-16 font-semibold placeholder:text-[15px] px-0 border-none shadow-none line-clamp-2"
              placeholder="наименование"
              disabled={isSubmitting}
              onFocus={(e) => e.target.select()}
              onBlur={(e) => handleFieldBlur("description", e.target.value)}
            />
          </MaterialData>

          <Input
            {...register("project_article")}
            type="text"
            className="placeholder:text-muted-foreground/40 h-6 placeholder:text-[15px] px-0 border-none shadow-none"
            placeholder="Марка"
            disabled={isSubmitting}
            onBlur={(e) => handleFieldBlur("project_article", e.target.value)}
            onFocus={(e) => e.target.select()}
          />
        </div>
        <div className="flex flex-col justify-between h-full">
          <MaterialData label="производитель">
            <Input
              {...register("manufacturer")}
              type="text"
              className="placeholder:text-muted-foreground/40 h-6 placeholder:text-[15px] px-0 border-none shadow-none"
              placeholder="-"
              disabled={isSubmitting}
              onBlur={(e) => handleFieldBlur("manufacturer", e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </MaterialData>
          <MaterialData label="артикул">
            <Input
              {...register("article")}
              type="text"
              className="placeholder:text-muted-foreground/40 h-6 placeholder:text-[15px] px-0 border-none shadow-none"
              placeholder="-"
              disabled={isSubmitting}
              onBlur={(e) => handleFieldBlur("article", e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </MaterialData>
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className="flex w-full grow justify-between">
            <MaterialData label="размер (мм)">
              <Input
                {...register("size")}
                type="text"
                className="placeholder:text-muted-foreground/40 h-6 placeholder:text-[15px] px-0 border-none shadow-none"
                placeholder="-"
                disabled={isSubmitting}
                onBlur={(e) => handleFieldBlur("size", e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </MaterialData>
            {/* <MaterialData label="д (мм)" value={material.size ||'-'} /> */}
          </div>
          <MaterialData label="цвет">
            <Input
              {...register("color")}
              type="text"
              className="placeholder:text-muted-foreground/40 h-6 placeholder:text-[15px] px-0 border-none shadow-none"
              placeholder="-"
              disabled={isSubmitting}
              onBlur={(e) => handleFieldBlur("color", e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </MaterialData>
        </div>
        <div className="flex flex-col justify-between h-full">
          <MaterialData label="стоимость">
            <Input
              {...register("price")}
              type="text"
              className="placeholder:text-muted-foreground/40 h-6 placeholder:text-[15px] px-0 border-none shadow-none"
              placeholder="-"
              disabled={isSubmitting}
              onBlur={(e) => handleFieldBlur("quantity", e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </MaterialData>
          <MaterialData label="кол-во">
            <Input
              {...register("quantity")}
              type="text"
              className="placeholder:text-muted-foreground/40 h-6 placeholder:text-[15px] px-0 border-none shadow-none"
              placeholder="-"
              disabled={isSubmitting}
              onBlur={(e) => handleFieldBlur("quantity", e.target.value)}
              onFocus={(e) => e.target.select()}
            />
          </MaterialData>
        </div>
        <div className="flex flex-col justify-between h-full">
          <MaterialData label="общая стоимость">
            <span className="font-bold">{formatPrice(totalPrice)} ₽</span>
            {/* {watchPrice && watchQuantity && (
              <span className="text-xs text-muted-foreground">
                {formatPrice(Number(watchPrice))} × {watchQuantity}
              </span>
            )} */}
          </MaterialData>
          <div className="grid grid-cols-4 gap-2 w-full">
            <Button
              size={"icon-sm"}
              variant={"link"}
              disabled={material.product_url ? false : true}
              className="hover:cursor-pointer hover:text-blue-500 col-span-1"
            >
              <Link
                href={material.product_url || ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                <LinkIcon />
              </Link>
            </Button>
            <Button
              size={"sm"}
              variant={"secondary"}
              className="hover:cursor-pointer col-span-3 text-ellipsis overflow-hidden"
            >
              Подробнее
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecMaterialCard;
