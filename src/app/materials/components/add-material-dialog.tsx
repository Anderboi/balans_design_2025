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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { materialsService } from "@/lib/services/materials";
import { MaterialType, Contact, ContactType, Company } from "@/types";
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

interface AddMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialAdded: () => void;
  initialSuppliers: Contact[];
  initialSupplierCompanies: Company[];
}

export function AddMaterialDialog({
  open,
  onOpenChange,
  onMaterialAdded,
  initialSuppliers,
  initialSupplierCompanies,
}: AddMaterialDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddMaterialFormValues>({
    resolver: zodResolver(AddMaterialSchema) as Resolver<AddMaterialFormValues>,
    defaultValues: {
      name: "",
      description: "",
      manufacturer: "",
      article: "",
      lead_time: 0,
      product_url: "",
      size: "",
      color: "",
      finish: "",
      material: "",
      type: undefined,
      supplier: "",
      price: 0,
      unit: "шт",
      image_url: "",
      in_stock: true,
      tags: [],
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

      await materialsService.createMaterial({
        ...values,
        image_url: finalImageUrl || "",
      });

      onMaterialAdded();
      onOpenChange(false);
      form.reset();
      imageUpload.resetImage();
      tagManagement.resetTags();
    } catch (error) {
      console.error("Ошибка при создании материала:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChangeWrapper = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      imageUpload.resetImage();
      tagManagement.resetTags();
    }
    onOpenChange(newOpen);
  };

  const materialTypes = Object.values(MaterialType);
  const commonUnits = ["шт", "м.п.", "м²", "м³", "кг", "л", "упак", "комплект"];

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWrapper}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить новый материал</DialogTitle>
          <DialogDescription>
            Заполните информацию о материале для добавления в библиотеку
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Обложка материала */}
            <ImageUploadSection
              imagePreview={imageUpload.imagePreview}
              onImageSelect={imageUpload.handleImageSelect}
              onImageRemove={imageUpload.handleImageRemove}
              fileInputRef={imageUpload.fileInputRef}
            />

            {/* Основная информация */}
            <BasicInfoSection control={control} materialTypes={materialTypes} />

            {/* Поставщик */}
            <SupplierSection
              control={control}
              filteredSuppliers={supplierSelection.filteredSuppliers}
              supplierCompaniesMap={supplierSelection.supplierCompaniesMap}
              supplierQuery={supplierSelection.supplierQuery}
              setSupplierQuery={supplierSelection.setSupplierQuery}
              setIsAddSupplierOpen={supplierSelection.setIsAddSupplierOpen}
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChangeWrapper(false)}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Создание..." : "Создать материал"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        <AddContactDialog
          isOpen={supplierSelection.isAddSupplierOpen}
          onOpenChange={supplierSelection.setIsAddSupplierOpen}
          onSubmit={supplierSelection.handleCreateSupplier}
          defaultCompanyName={supplierSelection.supplierQuery}
          defaultType={ContactType.SUPPLIER}
        />
      </DialogContent>
    </Dialog>
  );
}
