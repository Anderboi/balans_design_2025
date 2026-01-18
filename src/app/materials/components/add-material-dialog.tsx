"use client";

import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AddMaterialSchema,
  AddMaterialFormValues,
} from "@/lib/schemas/materials";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { materialsService } from "@/lib/services/materials";
import { MaterialType, Contact, ContactType } from "@/types";
import { CompanyType } from "@/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { FileDropzone } from "../../../components/ui/dropzone";
import { storageService } from "@/lib/services/storage";
import { contactsService } from "@/lib/services/contacts";
import { companiesService } from "@/lib/services/companies";
import AddContactDialog from "@/app/contacts/components/add-contact-dialog";

interface AddMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialAdded: () => void;
}

export function AddMaterialDialog({
  open,
  onOpenChange,
  onMaterialAdded,
}: AddMaterialDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Contact[]>([]);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [supplierQuery, setSupplierQuery] = useState("");
  const [supplierCompaniesMap, setSupplierCompaniesMap] = useState<
    Record<string, string>
  >({});

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

  const { watch, setValue, control } = form;
  const currentTags = watch("tags");

  const handleAddTag = () => {
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const onSubmit = async (values: AddMaterialFormValues) => {
    try {
      setIsLoading(true);

      let finalImageUrl = values.image_url;
      // Если выбрано изображение, загружаем в Storage
      if (imageFile) {
        finalImageUrl = await storageService.uploadMaterialImage(imageFile);
      }

      await materialsService.createMaterial({
        ...values,
        image_url: finalImageUrl || "",
      });

      onMaterialAdded();
      onOpenChange(false);
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      setTagInput("");
    } catch (error) {
      console.error("Ошибка при создании материала:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChangeWrapper = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
      setImageFile(null);
      setImagePreview(null);
      setTagInput("");
    }
    onOpenChange(newOpen);
  };

  // Загрузка списка поставщиков
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await contactsService.getContactsByType(
          ContactType.SUPPLIER
        );
        setSuppliers(data);
      } catch (error) {
        console.error("Ошибка при загрузке поставщиков:", error);
      }
    };
    loadSuppliers();
  }, []);

  // Загрузка компаний
  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const companies = await companiesService.getCompaniesByType(
          CompanyType.SUPPLIER
        );
        const map: Record<string, string> = {};
        (companies as any[]).forEach((c) => {
          if (c && c.id) map[c.id] = c.name;
        });
        setSupplierCompaniesMap(map);
      } catch (error) {
        console.error("Ошибка при загрузке компаний:", error);
      }
    };
    loadCompanies();
  }, []);

  const handleCreateSupplier = async (
    contact: Omit<Contact, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const created = await contactsService.createContact({
        ...contact,
        type: ContactType.SUPPLIER,
      });
      setSuppliers((prev) => [created, ...prev]);
      setValue("supplier", created.name);
      setIsAddSupplierOpen(false);
    } catch (error) {
      console.error("Ошибка при создании поставщика:", error);
    }
  };

  const filteredSuppliers = suppliers.filter((s) => {
    const companyName = s.company_id
      ? supplierCompaniesMap[s.company_id] || ""
      : "";
    const hay = `${s.name} ${companyName}`.toLowerCase();
    return hay.includes(supplierQuery.toLowerCase());
  });

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
            <div className="space-y-3">
              <Label>Обложка (изображение)</Label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Предпросмотр"
                    className="w-full h-48 object-cover rounded-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                  >
                    Удалить изображение
                  </Button>
                </div>
              ) : (
                <FileDropzone
                  fileInputRef={fileInputRef}
                  handleBoxClick={() => fileInputRef.current?.click()}
                  handleDragOver={(e) => {
                    e.preventDefault();
                  }}
                  handleDrop={(e) => {
                    e.preventDefault();
                    const files = e.dataTransfer.files;
                    if (!files || files.length === 0) return;
                    const file = files[0];
                    if (!file.type.startsWith("image/")) return;
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                  handleFileSelect={(files) => {
                    if (!files || files.length === 0) return;
                    const file = files[0];
                    if (!file.type.startsWith("image/")) return;
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                  }}
                />
              )}
            </div>

            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Наименование *</FormLabel>
                    <FormControl>
                      <Input placeholder="Наименование материала" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Категория *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите категорию" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {materialTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Input placeholder="Описание материала" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Производитель</FormLabel>
                    <FormControl>
                      <Input placeholder="Название производителя" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Поставщик */}
              <FormField
                control={control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Поставщик</FormLabel>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between font-normal"
                          >
                            <span>{field.value || "Выберите поставщика"}</span>
                            <ChevronDownIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[300px]">
                        <div className="p-2">
                          <Input
                            placeholder="Поиск или создание..."
                            value={supplierQuery}
                            onChange={(e) => setSupplierQuery(e.target.value)}
                          />
                        </div>
                        {filteredSuppliers.map((s) => {
                          const companyName = s.company_id
                            ? supplierCompaniesMap[s.company_id]
                            : undefined;
                          const displayName = companyName
                            ? `${s.name} — ${companyName}`
                            : s.name;
                          return (
                            <DropdownMenuItem
                              key={s.id}
                              onSelect={() => field.onChange(displayName)}
                            >
                              {displayName}
                            </DropdownMenuItem>
                          );
                        })}
                        {filteredSuppliers.length === 0 && supplierQuery && (
                          <DropdownMenuItem
                            onSelect={() => setIsAddSupplierOpen(true)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Добавить &quot;{supplierQuery}&quot;
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="article"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Артикул</FormLabel>
                    <FormControl>
                      <Input placeholder="Артикул материала" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="lead_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Срок поставки (дней)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        {...field}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* В наличии */}
            <FormField
              control={control}
              name="in_stock"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">В наличии</FormLabel>
                </FormItem>
              )}
            />

            {/* Цена и единица измерения */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена (₽)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onFocus={(e) => e.target.select()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Единица измерения</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите единицу" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commonUnits.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Дополнительные характеристики */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цвет</FormLabel>
                    <FormControl>
                      <Input placeholder="Цвет материала" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Материал</FormLabel>
                    <FormControl>
                      <Input placeholder="Материал" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="finish"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Покрытие</FormLabel>
                    <FormControl>
                      <Input placeholder="Покрытие" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Размер</FormLabel>
                    <FormControl>
                      <Input placeholder="Размер материала" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* URL изображения */}
            <FormField
              control={control}
              name="product_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL продукта</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Теги */}
            <div className="space-y-2">
              <Label>Теги</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Добавить тег"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  size="icon"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {currentTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {currentTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

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
          isOpen={isAddSupplierOpen}
          onOpenChange={setIsAddSupplierOpen}
          onSubmit={handleCreateSupplier}
          defaultCompanyName={supplierQuery}
          defaultType={ContactType.SUPPLIER}
        />
      </DialogContent>
    </Dialog>
  );
}
