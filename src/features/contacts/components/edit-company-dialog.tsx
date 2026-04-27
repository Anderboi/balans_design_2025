"use client";

import { useState } from "react";
import { Company, CompanyType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormRow } from "@/components/ui/form-row";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateCompany: (company: Partial<Company>) => void;
  company: Company | null;
}

export function EditCompanyDialog({
  open,
  onOpenChange,
  onUpdateCompany,
  company,
}: EditCompanyDialogProps) {
  const [formData, setFormData] = useState<Partial<Company>>(company || {});

  // Update form data if company prop changes (e.g. if dialog is reused)
  const [prevCompany, setPrevCompany] = useState(company);
  if (company !== prevCompany) {
    setPrevCompany(company);
    setFormData(company || {});
  }

  const [tag, setTag] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value as CompanyType }));
  };

  const handleAddTag = () => {
    if (tag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tag.trim()],
      }));
      setTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tagToRemove),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCompany(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Редактировать компанию</DialogTitle>
            <DialogDescription>
              Обновите информацию о компании
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <FormRow label="Название" htmlFor="name" required>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </FormRow>

            <FormRow label="Тип" htmlFor="type">
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CompanyType.CLIENT}>Клиент</SelectItem>
                  <SelectItem value={CompanyType.SUPPLIER}>
                    Поставщик
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormRow>

            <FormRow label="Веб-сайт" htmlFor="website">
              <Input
                id="website"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
              />
            </FormRow>

            <FormRow label="Email" htmlFor="email" required>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </FormRow>

            <FormRow label="Телефон" htmlFor="phone" required>
              <Input
                id="phone"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                required
              />
            </FormRow>

            <FormRow label="Адрес" htmlFor="address">
              <Input
                id="address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </FormRow>

            <FormRow label="Теги" htmlFor="tags">
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((t, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md"
                  >
                    {t}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => handleRemoveTag(t)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  id="tag"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-32"
                  placeholder="Новый тег"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddTag}
                >
                  +
                </Button>
              </div>
            </FormRow>

            <FormRow label="Примечания" htmlFor="notes">
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
              />
            </FormRow>
          </div>
          <DialogFooter>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
