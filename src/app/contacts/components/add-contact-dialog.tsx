"use client";

import { useState, useEffect } from "react";
import { Contact, ContactType, CompanyType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { companiesService } from "@/lib/services/companies";

interface AddContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (contact: Omit<Contact, "id" | "created_at" | "updated_at">) => void;
  companyId?: string;
  defaultName?: string; // deprecated: used for contact name (backward compatibility)
  defaultCompanyName?: string;
  defaultType?: ContactType;
}

export default function AddContactDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  companyId,
  defaultName,
  defaultCompanyName,
  defaultType,
}: AddContactDialogProps) {
  const [companyName, setCompanyName] = useState<string>(defaultCompanyName || "");
  const [formData, setFormData] = useState<
    Omit<Contact, "id" | "created_at" | "updated_at">
  >({
    name: defaultName || "",
    type: defaultType || ContactType.SUPPLIER,
    ...(companyId ? { company_id: companyId } : {}),
    position: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  // Обновляем company_id и name при изменении props
  useEffect(() => {
    setFormData(prev => {
      const base = { ...prev, name: defaultName || prev.name, type: defaultType || prev.type } as any;
      if (companyId) {
        return { ...base, company_id: companyId };
      }
      // удаляем company_id, если companyId не передан
      const { company_id, ...rest } = base;
      return rest;
    });
    setCompanyName(defaultCompanyName || companyName);
  }, [companyId, defaultName, defaultCompanyName, defaultType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...formData };
    // если company_id не указан, но заполнено название компании — создаем компанию
    if (!payload.company_id && companyName && companyName.trim().length > 0) {
      try {
        const company = await companiesService.createCompany({
          name: companyName.trim(),
          type: payload.type === ContactType.SUPPLIER ? CompanyType.SUPPLIER : CompanyType.CLIENT,
          website: "",
          email: payload.email || "",
          phone: payload.phone || "",
          address: payload.address || "",
          tags: [],
          notes: "",
        });
        payload.company_id = company.id;
      } catch (err) {
        console.error("Ошибка при создании компании:", err);
      }
    }
    // не отправляем пустой company_id
    if (!payload.company_id) {
      delete payload.company_id;
    }
    onSubmit(payload);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: defaultType || ContactType.SUPPLIER,
      ...(companyId ? { company_id: companyId } : {}),
      position: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    });
    setCompanyName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {companyId ? "Добавить представителя компании" : "Добавить новый контакт"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!companyId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company_name" className="text-right">
                  Название компании
                </Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Имя
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            {!companyId && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Тип
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange(value, "type")}
                  required
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Выберите тип контакта" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ContactType.CLIENT}>Клиент</SelectItem>
                    <SelectItem value={ContactType.SUPPLIER}>
                      Поставщик
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Должность
              </Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Телефон
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
                
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
                
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Адрес (не обязательно)
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Заметки (не обязательно)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
