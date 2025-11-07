"use client";

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
  const [formData, setFormData] = useState({
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
    type: "" as MaterialType,
    supplier: "",
    price: 0,
    unit: "",
    image_url: "",
    in_stock: true,
    tags: [] as string[],
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.manufacturer) {
      return;
    }

    try {
      setIsLoading(true);
      // Если выбрано изображение, загружаем в Storage и подставляем URL
      if (imageFile) {
        const publicUrl = await storageService.uploadMaterialImage(imageFile);
        handleInputChange("image_url", publicUrl);
      }
      await materialsService.createMaterial(formData);
      onMaterialAdded();

      // Сброс формы
      setFormData({
        name: "",
        type: "" as MaterialType,
        product_url: "",
        lead_time: 0,
        finish: "",
        material: "",
        manufacturer: "",
        supplier: "",
        price: 0,
        unit: "",
        description: "",
        image_url: "",
        color: "",
        size: "",
        article: "",
        in_stock: true,
        tags: [],
      });
      setTagInput("");
      setImageFile(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Ошибка при создании материала:", error);
    } finally {
      setIsLoading(false);
    }
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

  // Загрузка компаний (для отображения названия рядом с контактом)
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
      handleInputChange("supplier", created.name);
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
  const commonCategories = [
    "Напольные покрытия",
    "Настенные покрытия",
    "Потолочные материалы",
    "Сантехника",
    "Электрика",
    "Мебель",
    "Аксессуары",
    "Краски и лаки",
    "Клеи и герметики",
    "Инструменты",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить новый материал</DialogTitle>
          <DialogDescription>
            Заполните информацию о материале для добавления в библиотеку
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Обложка материала (изображение) */}
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
                    handleInputChange("image_url", "");
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
            <div className="space-y-2">
              <Label htmlFor="name">Наименование *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Наименование материала"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Категория *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {materialTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Описание материала"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="manufacturer">Производитель</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) =>
                  handleInputChange("manufacturer", e.target.value)
                }
                placeholder="Название производителя"
              />
            </div>

            {/* Поставщик */}
            <div className="space-y-2">
              <Label htmlFor="supplier">Поставщик</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span>{formData.supplier || "Выберите поставщика"}</span>
                    <ChevronDownIcon className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
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
                    return (
                      <DropdownMenuItem
                        key={s.id}
                        onSelect={() =>
                          handleInputChange(
                            "supplier",
                            companyName ? `${s.name} — ${companyName}` : s.name
                          )
                        }
                      >
                        {companyName ? `${s.name} — ${companyName}` : s.name}
                      </DropdownMenuItem>
                    );
                  })}
                  {filteredSuppliers.length === 0 && supplierQuery && (
                    <DropdownMenuItem
                      onSelect={() => {
                        setIsAddSupplierOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Добавить '{supplierQuery}'
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <Label htmlFor="article">Артикул</Label>
              <Input
                id="article"
                value={formData.article}
                onChange={(e) => handleInputChange("article", e.target.value)}
                placeholder="Артикул материала"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead_time">Срок поставки</Label>
              <Input
                id="lead_time"
                value={formData.lead_time}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  handleInputChange("lead_time", parseInt(e.target.value) || 0)
                }
                placeholder="Срок поставки"
              />
            </div>
          </div>

          {/* В наличии */}
          <div className="flex items-center space-x-2">
            <Switch
              id="in_stock"
              checked={formData.in_stock}
              onCheckedChange={(checked) =>
                handleInputChange("in_stock", checked)
              }
            />
            <Label htmlFor="in_stock">В наличии</Label>
          </div>

          {/* Цена и единица измерения */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Цена (₽)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onFocus={(e) => e.target.select()}
                onChange={(e) =>
                  handleInputChange("price", parseFloat(e.target.value) || 0)
                }
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Единица измерения</Label>
              <Select
                defaultValue={commonUnits[0]}
                value={formData.unit}
                onValueChange={(value) => handleInputChange("unit", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите единицу" />
                </SelectTrigger>
                <SelectContent>
                  {commonUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Дополнительные характеристики */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Цвет</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                placeholder="Цвет материала"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Материал</Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => handleInputChange("material", e.target.value)}
                placeholder="Материал"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finish">Покрытие</Label>
              <Input
                id="finish"
                value={formData.finish}
                onChange={(e) => handleInputChange("finish", e.target.value)}
                placeholder="Покрытие"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Размер</Label>
              <Input
                id="size"
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                placeholder="Размер материала"
              />
            </div>
          </div>

          {/* Описание */}
          {/* <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Подробное описание материала"
              rows={3}
            />
          </div> */}

          {/* URL изображения */}
          <div className="space-y-2">
            <Label htmlFor="product_url">URL продукта</Label>
            <Input
              id="product_url"
              type="url"
              value={formData.product_url}
              onChange={(e) => handleInputChange("product_url", e.target.value)}
              placeholder="https://example.com"
            />
          </div>

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
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
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
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Создание..." : "Создать материал"}
            </Button>
          </DialogFooter>
        </form>
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
