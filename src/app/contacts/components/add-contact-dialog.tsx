"use client";

import { useState } from "react";
import { Contact, ContactType, CompanyType } from "@/types";
import { Button } from "@/components/ui/button";
import { FormRow } from "@/components/ui/form-row";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
  onSubmit: (
    contact: Omit<Contact, "id" | "created_at" | "updated_at">,
  ) => void;
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
  const [companyName, setCompanyName] = useState<string>(
    defaultCompanyName || "",
  );
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

  // Синхронизируем состояние с пропсами при открытии или изменении ключевых пропсов
  const [prevProps, setPrevProps] = useState({
    companyId,
    defaultName,
    defaultCompanyName,
    defaultType,
    isOpen,
  });

  if (
    isOpen &&
    (companyId !== prevProps.companyId ||
      defaultName !== prevProps.defaultName ||
      defaultCompanyName !== prevProps.defaultCompanyName ||
      defaultType !== prevProps.defaultType ||
      isOpen !== prevProps.isOpen)
  ) {
    // Обновляем пропсы для сравнения в следующем рендере
    setPrevProps({
      companyId,
      defaultName,
      defaultCompanyName,
      defaultType,
      isOpen,
    });

    const isOpening = isOpen && !prevProps.isOpen;

    // Если диалог только что открылся или изменились пропсы, обновляем форму
    // Это обновление происходит во время рендера, что эффективнее useEffect для синхронизации
    setFormData((prev) => {
      const base = {
        ...prev,
        name: defaultName || (isOpening ? "" : prev.name),
        type: defaultType || (isOpening ? ContactType.SUPPLIER : prev.type),
        ...(isOpening
          ? {
              position: "",
              phone: "",
              email: "",
              address: "",
              notes: "",
            }
          : {}),
      };

      if (companyId) {
        return { ...base, company_id: companyId };
      }
      const { ...rest } = base;
      return rest;
    });
    setCompanyName(defaultCompanyName || (isOpening ? "" : companyName));
  }

  const isClient = formData.type === ContactType.CLIENT;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<Contact> & { company_id?: string } = { ...formData };
    // если company_id не указан, но заполнено название компании — создаем компанию
    if (!payload.company_id && companyName && companyName.trim().length > 0) {
      try {
        const company = await companiesService.createCompany({
          name: companyName.trim(),
          type:
            payload.type === ContactType.SUPPLIER
              ? CompanyType.SUPPLIER
              : CompanyType.CLIENT,
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
    if (!payload.name) {
      return;
    }
    onSubmit(payload as Omit<Contact, "id" | "created_at" | "updated_at">);
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
            {companyId
              ? "Добавить представителя компании"
              : isClient
                ? "Добавить клиента"
                : "Добавить новый контакт"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {!companyId && !isClient && (
              <FormRow label="Название компании" htmlFor="company_name">
                <Input
                  id="company_name"
                  name="company_name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </FormRow>
            )}

            <FormRow label="Ф.И.О." htmlFor="name" required>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </FormRow>

            {!companyId && (
              <FormRow label="Тип" htmlFor="type">
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange(value, "type")}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Выберите тип контакта" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ContactType.CLIENT}>Клиент</SelectItem>
                    <SelectItem value={ContactType.SUPPLIER}>
                      Поставщик
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormRow>
            )}

            {!isClient && (
              <FormRow
                label="Должность"
                htmlFor="position"
                required={!isClient}
              >
                <Input
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  required={!isClient}
                />
              </FormRow>
            )}

            <FormRow label="Телефон" htmlFor="phone">
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </FormRow>

            <FormRow label="Email" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </FormRow>

            {!isClient && (
              <>
                <FormRow label="Адрес" htmlFor="address">
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Не обязательно"
                  />
                </FormRow>

                <FormRow label="Заметки" htmlFor="notes">
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Не обязательно"
                  />
                </FormRow>
              </>
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
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
