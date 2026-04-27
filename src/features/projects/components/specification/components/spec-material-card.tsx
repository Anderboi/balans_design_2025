"use client";

import MaterialData from "./material-data";
import { SpecificationMaterial, MaterialStatus } from "@/types";
import { useForm } from "react-hook-form";
import { materialsService } from "@/lib/services/materials";
import { toast } from "sonner";
import { useCallback, useMemo } from "react";
import { Separator } from "@/components/ui/separator";
import Thumbnail from "./thumbnail";
import { DebouncedInput } from "@/components/debounced-input";
import { cn } from "@/lib/utils";
import StatusDropdown from './status-dropdown';
import ActionButtons from './action-buttons';



interface SpecMaterialCardProps {
  material: SpecificationMaterial;
  onUpdate?: (updated: SpecificationMaterial) => void;
}

const SpecMaterialCard = ({ material, onUpdate }: SpecMaterialCardProps) => {
  const {
    watch,
    formState: { dirtyFields },
    reset,
    getValues,
    setValue,
  } = useForm<SpecificationMaterial>({
    values: {
      ...material,
      name: material.name ?? "",
      manufacturer: material.manufacturer ?? "",
      article: material.article ?? "",
      price: Number(material.price) || 0,
      quantity: Number(material.quantity) || 1,
      project_article: material.project_article ?? "",
      status: material.status ?? MaterialStatus.NOT_SELECTED,
    },
    resetOptions: {
      keepDirtyValues: true,
    },
  });

  const formValues = watch();
  const watchQuantity = formValues.quantity;
  const watchPrice = formValues.price;
  const watchStatus = formValues.status;
  const manufacturer = formValues.manufacturer;

  // Вычисляем общую стоимость
  const totalPrice = useMemo(
    () => (Number(watchQuantity) || 0) * (Number(watchPrice) || 0),
    [watchQuantity, watchPrice],
  );

  // Форматируем число с пробелами для тысяч
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("ru-RU", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Сохранение конкретного поля при потере фокуса
  const handleFieldBlur = useCallback(
    async (fieldName: keyof SpecificationMaterial) => {
      // Проверяем, было ли поле изменено
      if (!dirtyFields[fieldName]) return;

      const currentValues = getValues();
      const raw = currentValues[fieldName];
      const value =
        fieldName === "price" || fieldName === "quantity"
          ? Number(raw) || 0
          : raw;

      try {
        await materialsService.updateSpecMaterial(material.id, {
          [fieldName]: value,
        });
        reset(currentValues);
        onUpdate?.({ ...material, [fieldName]: value });
        toast.success("Изменения сохранены", { duration: 1000 });
      } catch {
        toast.error("Не удалось сохранить изменения");
        reset(material);
      }
    },
    [dirtyFields, getValues, material, onUpdate, reset],
  );

  const handleStatusChange = useCallback(
    async (value: string) => {
      const statusValue = value as MaterialStatus;
      try {
        await materialsService.updateSpecMaterial(material.id, {
          status: statusValue,
        });
        onUpdate?.({ ...material, status: statusValue });
        // keepValues: true — don't reset other fields, only mark status as clean
        reset({ ...getValues(), status: statusValue });
        toast.success("Статус обновлён", { duration: 1000 });
      } catch {
        toast.error("Ошибка обновления статуса");
      }
    },
    [getValues, material, onUpdate, reset],
  );

  // Helper to retrieve props for debounced controlled inputs
  const debouncedProps = (
    field: keyof SpecificationMaterial,
  ) => {
    const val = formValues[field];
    return {
      name: field,
      value: (val !== undefined && val !== null ? val : "") as string | number,
      onChange: (debouncedValue: string) => {
        setValue(field, debouncedValue, { shouldDirty: true, shouldTouch: true });
        handleFieldBlur(field);
      },
    };
  };

  const numberInputClass =
    "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

  return (
    <div className="bg-white w-full rounded-3xl border border-[#F2F2F7] shadow-sm overflow-hidden transition-all hover:shadow-md group">
      {/* Desktop Version -------------------------------------------------*/}
      <div className="hidden md:flex items-stretch p-3 gap-6">
        {/* Left: Image */}
        <Thumbnail
          name={material.name}
          url={material.image_url}
          className="size-[88px]"
        />

        {/* Content Area */}
        <div className="flex flex-1 gap-4">
          {/* Section 1: Mark & Name */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex flex-col items-start">
              <DebouncedInput
                {...debouncedProps("name")}
                className="resize-none font-semibold text-lg text-[#1D1D1F] leading-tight  flex-1 transition-all"
              />
              <span className="text-[11px] text-[#86868B] uppercase tracking-wide">
                {manufacturer}
              </span>
            </div>

            <DebouncedInput
              {...debouncedProps("project_article")}
              placeholder="Арт."
              className="px-0 py-0.5 border-none bg-transparent shadow-none font-bold text-[13px] text-[#0071E3] text-start focus-visible:ring-0"
            />
          </div>

          <Separator orientation="vertical" className="bg-border" />

          {/* Section 2: Details */}
          <div className="flex-1">
            <MaterialData label="Наименование">
              <DebouncedInput
                {...debouncedProps("description")}
                className="p-0 border-none shadow-none text-sm font-medium h-auto focus-visible:ring-0 truncate"
              />
            </MaterialData>
          </div>

          {/* Section 3: Quantity and Price */}
          <div className="flex flex-col justify-between items-end px-4 w-24 text-right">
            <MaterialData label="Кол-во" className="items-end">
              <div className="flex items-baseline gap-1">
                <DebouncedInput
                  type="number"
                  {...debouncedProps("quantity")}
                  className={cn(
                    "text-base font-medium text-right w-10",
                    numberInputClass,
                  )}
                />
                <span className="text-base text-[#1D1D1F]">
                  {material.unit ?? "шт"}
                </span>
              </div>
            </MaterialData>
            <MaterialData label="Цена / шт" className="items-end">
              <div className="flex items-baseline gap-1">
                <DebouncedInput
                  type="number"
                  {...debouncedProps("price")}
                  className={cn(
                    "text-base font-medium text-right w-16",
                    numberInputClass,
                  )}
                />
                <span className="text-base text-foreground">₽</span>
              </div>
            </MaterialData>
          </div>

          <Separator orientation="vertical" className="bg-border" />

          {/* Section 4: Total */}
          <div className="flex flex-col justify-end h-full items-end w-40 text-right">
            <span className="text-[20px] font-bold text-[#1D1D1F] leading-none tabular-nums">
              {formatPrice(totalPrice)} ₽
            </span>
            <span className="text-[10px] text-[#8E8E93] uppercase font-medium tracking-widest">
              Итого
            </span>
          </div>

          <Separator orientation="vertical" className="bg-border" />

          {/* Right: Actions & Status */}
          <div className="flex flex-col justify-between gap-2">
            <StatusDropdown
              value={watchStatus ?? "in_progress"}
              onChange={handleStatusChange}
            />
            <ActionButtons productUrl={material.product_url} size="sm" />
          </div>
        </div>
      </div>

      {/* Mobile Version --------------------------------------------------*/}
      <div className="md:hidden flex flex-col gap-4 p-4">
        {/* Header */}
        <div className="flex gap-4">
          <Thumbnail
            url={material.image_url}
            name={material.name}
            className="size-24"
          />

          {/* Name & Mark */}
          <div className="flex-1 flex flex-col justify-between">
            <div
            // className="flex flex-col items-start"
            >
              <DebouncedInput
                {...debouncedProps("name")}
                className="font-semibold text-[15px] text-[#1D1D1F] leading-snug"
              />
              <span className="text-[11px] text-[#86868B] uppercase tracking-wide">
                {manufacturer}
              </span>
            </div>

            <DebouncedInput
              {...debouncedProps("project_article")}
              className="font-bold text-[12px] text-[#0071E3] //w-10 text-start"
            />
          </div>
          <StatusDropdown
            value={watchStatus ?? "in_progress"}
            onChange={handleStatusChange}
          />
        </div>

        <Separator className="bg-border" />

        {/* Middle section */}
        <div className="flex gap-3 flex-2">
          <MaterialData label="Наименование">
            <DebouncedInput
              {...debouncedProps("description")}
              className="text-sm font-medium text-[#1D1D1F]"
            />
          </MaterialData>

          <Separator orientation="vertical" className="bg-border" />

          <MaterialData label="Кол-во" className="items-end flex-1">
            <div className="flex items-baseline gap-0.5 justify-end">
              <DebouncedInput
                type="number"
                {...debouncedProps("quantity")}
                className={cn("text-end text-sm font-medium", numberInputClass)}
              />
              <span className="text-sm text-[#1D1D1F]">
                {material.unit ?? "шт"}
              </span>
            </div>
          </MaterialData>

          <Separator orientation="vertical" className="bg-border" />

          <MaterialData label="Цена / шт." className="flex-1 items-end">
            <div className="flex items-baseline gap-0.5 justify-end">
              <DebouncedInput
                type="number"
                {...debouncedProps("price")}
                className={cn("text-end text-sm font-medium", numberInputClass)}
              />
              <span className="text-sm text-[#1D1D1F]">₽</span>
            </div>
          </MaterialData>
        </div>

        <Separator className="bg-border" />

        <div className="flex items-center justify-between">
          <div
          className="flex flex-col min-w-[60%]"
          >
            <span className="font-bold text-[#1D1D1F] leading-none text-2xl tabular-nums">
              {formatPrice(totalPrice)} ₽
            </span>
            <span className="text-[9px] text-[#8E8E93] uppercase font-medium tracking-widest">
              Итого
            </span>
          </div>
          <ActionButtons productUrl={material.product_url} size="md"/>
        </div>
      </div>
    </div>
  );
};

export default SpecMaterialCard;
