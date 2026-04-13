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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { materialsService } from "@/lib/services/materials";
import { storageService } from "@/lib/services/storage";
import { Material, MaterialType, Contact, ContactType, Company } from "@/types";
import AddContactDialog from "@/app/(protected)/contacts/components/add-contact-dialog";

// Custom hooks
import { useTagManagement } from "@/app/materials/hooks/use-tag-management";
import { useSupplierSelection } from "@/app/materials/hooks/use-supplier-selection";

// Sub-components
import { ImageUploadSection } from "@/components/image-upload-section";
import { BasicInfoSection } from "./add-material-dialog/basic-info-section";
import { SupplierSection } from "./add-material-dialog/supplier-section";
import { DeliveryInfoSection } from "./add-material-dialog/delivery-info-section";
import { PricingSection } from "./add-material-dialog/pricing-section";
import { SpecificationsSection } from "./add-material-dialog/specifications-section";
import { AdditionalInfoSection } from "./add-material-dialog/additional-info-section";
import { CustomSpecificationsSection } from "./add-material-dialog/custom-specifications-section";
import SubBlockCard from "@/components/ui/sub-block-card";
import { MaterialFilesSection } from "./add-material-dialog/material-files-section";
import { useImageUpload } from '@/hooks/use-image-upload';

// ... existing imports

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
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

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
      custom_specifications: material.custom_specifications || [],
      attachments: material.attachments || [],
    },
  });

  const {
    formState: { isDirty },
    setValue,
    watch,
    control,
  } = form;

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
        const uploadedUrl = await storageService.uploadMaterialImage(imageUpload.imageFile);
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
      if (isDirty || imageUpload.imageFile) {
        setShowExitConfirmation(true);
        return;
      }
      
      imageUpload.resetImage();
      tagManagement.resetTags();
    }
    onOpenChange(newOpen);
  };

  const confirmClose = () => {
    setShowExitConfirmation(false);
    imageUpload.resetImage();
    tagManagement.resetTags();
    onOpenChange(false);
  };

  const materialTypes = Object.values(MaterialType);
  const commonUnits = ["шт", "м.п.", "м²", "м³", "кг", "л", "упак", "комплект"];

  return (
    <>
      <Drawer
        open={open}
        direction="bottom"
        onOpenChange={handleOpenChangeWrapper}
      >
        <DrawerContent className="//max-h-[95vh] sm:min-w-[640px]">
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
                    imagePreview={
                      imageUpload.imagePreview || material.image_url || null
                    }
                    onImageSelect={imageUpload.handleImageSelect}
                    onImageRemove={imageUpload.handleImageRemove}
                    fileInputRef={imageUpload.fileInputRef}
                  />

                  <SubBlockCard title="Основная информация">
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
                    <PricingSection
                      control={control}
                      commonUnits={commonUnits}
                    />

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
                  </SubBlockCard>
                  <SubBlockCard title="Пользовательские характеристики">
                    {/* Пользовательские характеристики */}
                    <CustomSpecificationsSection control={control} />
                  </SubBlockCard>
                  <SubBlockCard title="Прикрепленные файлы">
                    <MaterialFilesSection control={control} />
                  </SubBlockCard>
                </div>
              </ScrollArea>

              <DrawerFooter>
                <div className="flex flex-col-reverse sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => handleOpenChangeWrapper(false)}
                    className="sm:flex-1"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="sm:flex-1 rounded-full"
                  >
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

      <AlertDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить редактирование?</AlertDialogTitle>
            <AlertDialogDescription>
              У вас есть несохраненные изменения. Все внесенные изменения будут
              потеряны.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-base border-none shadow-none h-12">
              Продолжить редактирование
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClose}
              className="bg-destructive text-white text-base h-12 rounded-full hover:bg-destructive/90"
            >
              Да, отменить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
