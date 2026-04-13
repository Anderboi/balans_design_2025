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
import { materialsService } from "@/lib/services/materials";
import { storageService } from "@/lib/services/storage";
import { MaterialType, Contact, ContactType, Company } from "@/types";
import AddContactDialog from "@/app/(protected)/contacts/components/add-contact-dialog";

// Custom hooks
import { useImageUpload } from "@/hooks/use-image-upload";
import { useTagManagement } from "@/app/materials/hooks/use-tag-management";
import { useSupplierSelection } from "@/app/materials/hooks/use-supplier-selection";

// Sub-components
import { BasicInfoSection } from "./add-material-dialog/basic-info-section";
import { SupplierSection } from "./add-material-dialog/supplier-section";
import { DeliveryInfoSection } from "./add-material-dialog/delivery-info-section";
import { PricingSection } from "./add-material-dialog/pricing-section";
import { SpecificationsSection } from "./add-material-dialog/specifications-section";
import { CustomSpecificationsSection } from "./add-material-dialog/custom-specifications-section";
import { AdditionalInfoSection } from "./add-material-dialog/additional-info-section";
import SubBlockCard from "@/components/ui/sub-block-card";
import { MaterialFilesSection } from "./add-material-dialog/material-files-section";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageUploadSection } from '@/components/image-upload-section';

// ... existing imports

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
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

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
      custom_specifications: [],
      attachments: [],
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
      // Если есть изменения или выбрано изображение — показываем предупреждение
      if (isDirty || imageUpload.imageFile) {
        setShowExitConfirmation(true);
        return;
      }
      
      form.reset();
      imageUpload.resetImage();
      tagManagement.resetTags();
    }
    onOpenChange(newOpen);
  };

  const confirmClose = () => {
    setShowExitConfirmation(false);
    form.reset();
    imageUpload.resetImage();
    tagManagement.resetTags();
    onOpenChange(false);
  };

  const materialTypes = Object.values(MaterialType);
  const commonUnits = ["шт", "м.п.", "м²", "м³", "кг", "л", "упак", "комплект"];

  return (
    <Dialog open={open} onOpenChange={handleOpenChangeWrapper}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить новый материал</DialogTitle>
          <DialogDescription>
            Заполните информацию о материале для добавления в библиотеку
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col h-full min-h-0"
          >
            <ScrollArea className="flex-1">
              <div className="space-y-4 pb-4">
                {/* Обложка материала */}
                <ImageUploadSection
                  imagePreview={imageUpload.imagePreview}
                  onImageSelect={imageUpload.handleImageSelect}
                  onImageRemove={imageUpload.handleImageRemove}
                  fileInputRef={imageUpload.fileInputRef}
                  error={form.formState.errors.image_url?.message}
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

            <DialogFooter className="//p-6 pt-6 border-t shrink-0">
              <Button
                type="button"
                size="lg"
                variant="ghost"
                onClick={() => handleOpenChangeWrapper(false)}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="rounded-full px-6"
              >
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

        <AlertDialog open={showExitConfirmation} onOpenChange={setShowExitConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Отменить создание?</AlertDialogTitle>
              <AlertDialogDescription>
                У вас есть несохраненные изменения. Все заполненные данные будут потеряны.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='text-base border-none shadow-none h-12'>Продолжить заполнение</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmClose}
                className="bg-destructive h-12 rounded-full text-base text-white hover:bg-destructive/90"
              >
                Да, отменить
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}
