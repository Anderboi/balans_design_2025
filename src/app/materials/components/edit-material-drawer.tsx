"use client";

import { useState } from "react";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import {
  AddMaterialSchema,
  AddMaterialFormValues,
} from "@/lib/schemas/materials";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { materialsService } from "@/lib/services/materials";
import { Material, MaterialType, Contact, ContactType, Company } from "@/types";
import AddContactDialog from "@/app/contacts/components/add-contact-dialog";

// Custom hooks
import { useImageUpload } from "@/app/materials/hooks/use-image-upload";
import { useTagManagement } from "@/app/materials/hooks/use-tag-management";
import { useSupplierSelection } from "@/app/materials/hooks/use-supplier-selection";

// Sub-components
import { ImageUploadSection } from "./add-material-dialog/image-upload-section";
import { BasicInfoSection } from "./add-material-dialog/basic-info-section";
import { SupplierSection } from "./add-material-dialog/supplier-section";
import { DeliveryInfoSection } from "./add-material-dialog/delivery-info-section";
import { PricingSection } from "./add-material-dialog/pricing-section";
import { SpecificationsSection } from "./add-material-dialog/specifications-section";
import { AdditionalInfoSection } from "./add-material-dialog/additional-info-section";

interface EditMaterialDrawerProps {
  material: Material;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialUpdated: () => void;
  initialSuppliers: Contact[];
  initialSupplierCompanies: Company[];
}

export function EditMaterialDrawer({
  material,
  open,
  onOpenChange,
  onMaterialUpdated,
  initialSuppliers,
  initialSupplierCompanies,
}: EditMaterialDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddMaterialFormValues>({
    resolver: zodResolver(AddMaterialSchema) as Resolver<AddMaterialFormValues>,
    values: {
      name: material.name || "",
      description: material.description || "",
      manufacturer: material.manufacturer || "",
      article: material.article || "",
      lead_time: material.lead_time || 0,
      product_url: material.product_url || "",
      size: material.size || "",
      color: material.color || "",
      finish: material.finish || "",
      material: material.material || "",
      type: material.type || (undefined as any),
      supplier: material.supplier || "",
      price: material.price || 0,
      unit: material.unit || "шт",
      image_url: material.image_url || "",
      in_stock: material.in_stock ?? true,
      tags: material.tags || [],
    },
  });

  const { setValue, watch, control } = form;

  // Custom hooks
  const imageUpload = useImageUpload();
  const tagManagement = useTagManagement({ setValue, watch });
  const supplierSelection = useSupplierSelection({
    initialSuppliers,
    initialSupplierCompanies,
    setValue,
  });

  const onSubmit = async (values: AddMaterialFormValues) => {
    try {
      setIsLoading(true);

      let finalImageUrl = values.image_url;
      // Если выбрано изображение, загружаем в Storage
      if (imageUpload.imageFile) {
        const uploadedUrl = await imageUpload.uploadImage();
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      }

      await materialsService.updateMaterial(material.id, {
        ...values,
        image_url: finalImageUrl || "",
      });

      onMaterialUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Ошибка при обновлении материала:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChangeWrapper = (newOpen: boolean) => {
    if (!newOpen) {
      imageUpload.resetImage();
      tagManagement.resetTags();
    }
    onOpenChange(newOpen);
  };

  const materialTypes = Object.values(MaterialType);
  const commonUnits = ["шт", "м.п.", "м²", "м³", "кг", "л", "упак", "комплект"];

  return (
    <>
      <Drawer open={open} direction='right'  onOpenChange={handleOpenChangeWrapper}>
        <DrawerContent className="//max-h-[95vh] min-w-[640px]">
          <DrawerHeader>
            <DrawerTitle>Редактировать материал</DrawerTitle>
            <DrawerDescription>
              Внесите изменения в информацию о материале
            </DrawerDescription>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full overflow-hidden"
            >
              <ScrollArea className="flex-1 px-4 overflow-auto">
                <div className="space-y-8 pb-6">
                  {/* Обложка материала */}
                  <ImageUploadSection
                    control={control}
                    imagePreview={
                      imageUpload.imagePreview || material.image_url || null
                    }
                    onImageSelect={imageUpload.handleImageSelect}
                    onImageRemove={imageUpload.handleImageRemove}
                    fileInputRef={imageUpload.fileInputRef}
                  />

                  {/* Основная информация */}
                  <BasicInfoSection
                    control={control}
                    materialTypes={materialTypes}
                  />

                  {/* Поставщик */}
                  <SupplierSection
                    control={control}
                    filteredSuppliers={supplierSelection.filteredSuppliers}
                    supplierCompaniesMap={
                      supplierSelection.supplierCompaniesMap
                    }
                    supplierQuery={supplierSelection.supplierQuery}
                    setSupplierQuery={supplierSelection.setSupplierQuery}
                    setIsAddSupplierOpen={
                      supplierSelection.setIsAddSupplierOpen
                    }
                  />

                  {/* Доставка и наличие */}
                  <DeliveryInfoSection control={control} />

                  {/* Цена и единица измерения */}
                  <PricingSection control={control} commonUnits={commonUnits} />

                  {/* Дополнительные характеристики */}
                  <SpecificationsSection control={control} />

                  {/* URL и теги */}
                  <AdditionalInfoSection
                    control={control}
                    tagInput={tagManagement.tagInput}
                    setTagInput={tagManagement.setTagInput}
                    currentTags={tagManagement.currentTags}
                    handleAddTag={tagManagement.handleAddTag}
                    handleRemoveTag={tagManagement.handleRemoveTag}
                    handleKeyPress={tagManagement.handleKeyPress}
                  />
                </div>
              </ScrollArea>

              <DrawerFooter>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChangeWrapper(false)}
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                  <Button type="submit" disabled={isLoading} className="flex-1">
                    {isLoading ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>
      <AddContactDialog
        isOpen={supplierSelection.isAddSupplierOpen}
        onOpenChange={supplierSelection.setIsAddSupplierOpen}
        onSubmit={supplierSelection.handleCreateSupplier}
        defaultCompanyName={supplierSelection.supplierQuery}
        defaultType={ContactType.SUPPLIER}
      />
    </>
  );
}
