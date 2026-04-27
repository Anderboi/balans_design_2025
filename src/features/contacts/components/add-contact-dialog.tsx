"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Contact, ContactType, CompanyType, Company } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createCompany, getCompanies } from "../actions";
import { useIsMobile } from "@/hooks/use-mobile";
import StyledSelect from "@/components/ui/styled-select";

const formSchema = z.object({
  name: z.string().min(1, "Ф.И.О. обязательно"),
  type: z.enum(ContactType),
  company_id: z.string().optional(),
  company_name: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
  email: z.email("Некорректный email").or(z.string().length(0)),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (
    contact: Omit<Contact, "id" | "created_at" | "updated_at">,
  ) => void;
  companyId?: string;
  defaultName?: string;
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
  const isMobile = useIsMobile();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultName || "",
      type: defaultType || ContactType.SUPPLIER,
      company_id: companyId || "",
      company_name: defaultCompanyName || "",
      position: "",
      phone: "",
      email: "",
      address: "",
      notes: "",
    },
  });

  // Загружаем список компаний при открытии диалога
  useEffect(() => {
    if (isOpen) {
      const fetchCompanies = async () => {
        setIsLoadingCompanies(true);
        try {
          const data = await getCompanies();
          setCompanies(data);
        } catch (error) {
          console.error("Ошибка при загрузке компаний:", error);
        } finally {
          setIsLoadingCompanies(false);
        }
      };
      fetchCompanies();
    }
  }, [isOpen]);

  // Синхронизируем форму при открытии диалога или смене пропсов
  useEffect(() => {
    if (isOpen) {
      form.reset({
        name: defaultName || "",
        type: defaultType || ContactType.SUPPLIER,
        company_id: companyId || "",
        company_name: defaultCompanyName || "",
        position: "",
        phone: "",
        email: "",
        address: "",
        notes: "",
      });
    }
  }, [isOpen, defaultName, defaultType, defaultCompanyName, companyId, form]);

  const contactType = form.watch("type");
  const isClient = contactType === ContactType.CLIENT;

  const handleFormSubmit = async (values: FormValues) => {
    const payload: Omit<Contact, "id" | "created_at" | "updated_at"> = {
      name: values.name,
      type: values.type,
      position: values.position || "",
      phone: values.phone || "",
      email: values.email || "",
      address: values.address || "",
      notes: values.notes || "",
      ...(values.company_id ? { company_id: values.company_id } : {}),
    };

    // Если ID компании не выбран, но есть имя (создана новая опция в Select) — создаем компанию
    if (!values.company_id && values.company_name?.trim()) {
      try {
        const companyResult = await createCompany({
          name: values.company_name.trim(),
          type:
            values.type === ContactType.SUPPLIER
              ? CompanyType.SUPPLIER
              : CompanyType.CLIENT,
          website: "",
          email: values.email || "",
          phone: values.phone || "",
          address: values.address || "",
          tags: [],
          notes: "",
        });

        if (companyResult.success && companyResult.data) {
          payload.company_id = companyResult.data.id;
        }
      } catch (err) {
        console.error("Ошибка при создании компании:", err);
      }
    }

    onSubmit(payload);
    onOpenChange(false);
  };

  const companyOptions = companies.map((c) => ({
    label: c.name,
    value: c.id,
  }));

  const formContent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 px-4 pb-8 sm:px-0 sm:pb-0 font-geist"
      >
        <div className="grid gap-4 py-4">
          {!companyId && !isClient && (
            <FormField
              control={form.control}
              name="company_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Компания</FormLabel>
                  <FormControl>
                    <StyledSelect
                      options={companyOptions}
                      placeholder="Выберите или введите название..."
                      isLoading={isLoadingCompanies}
                      value={
                        companyOptions.find(
                          (opt) => opt.value === field.value,
                        ) ||
                        (form.getValues("company_name")
                          ? {
                              label: form.getValues("company_name")!,
                              value: "new",
                            }
                          : null)
                      }
                      onChange={(value) => {
                        field.onChange(value);
                        // Если выбрали существующую, очищаем временное имя
                        if (value) {
                          form.setValue("company_name", "");
                        }
                      }}
                      onCreateOption={(inputValue) => {
                        form.setValue("company_name", inputValue);
                        form.setValue("company_id", "");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ф.И.О.</FormLabel>
                <FormControl>
                  <Input placeholder="Иванов Иван Иванович" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {!companyId && (
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тип</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите тип контакта" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ContactType.CLIENT}>Клиент</SelectItem>
                      <SelectItem value={ContactType.SUPPLIER}>
                        Поставщик
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {!isClient && (
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Должность</FormLabel>
                  <FormControl>
                    <Input placeholder="Менеджер" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Телефон</FormLabel>
                  <FormControl>
                    <Input placeholder="+7 (000) 000-00-00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="example@mail.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {!isClient && (
            <>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Адрес</FormLabel>
                    <FormControl>
                      <Input placeholder="Город, улица, дом" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Заметки</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Дополнительная информация"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button type="submit">Сохранить</Button>
        </div>
      </form>
    </Form>
  );

  const title = companyId
    ? "Добавить представителя"
    : isClient
      ? "Добавить клиента"
      : "Добавить контакт";

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="font-geist">
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 max-h-[80vh]">{formContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] font-geist">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {formContent}
      </DialogContent>
    </Dialog>
  );
}
