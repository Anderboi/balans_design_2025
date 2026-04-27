"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Company, CompanyType} from "@/types";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  type: z.nativeEnum(CompanyType),
  website: z.string().optional(),
  email: z.string().email("Некорректный email").or(z.string().length(0)),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()),
  // Поля представителя
  representative_name: z.string().optional(),
  representative_position: z.string().optional(),
  representative_email: z
    .string()
    .email("Некорректный email")
    .or(z.string().length(0)),
  representative_phone: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddCompany: (
    company: Omit<Company, "id" | "created_at" | "updated_at">,
    representative?: {
      name: string;
      position: string;
      email?: string;
      phone?: string;
    },
  ) => void;
}

export function AddCompanyDialog({
  open,
  onOpenChange,
  onAddCompany,
}: AddCompanyDialogProps) {
  const [tagInput, setTagInput] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: CompanyType.SUPPLIER,
      website: "",
      email: "",
      phone: "",
      address: "",
      notes: "",
      tags: [],
      representative_name: "",
      representative_position: "",
      representative_email: "",
      representative_phone: "",
    },
  });

  const { control, handleSubmit, reset, watch, setValue } = form;
  const tags = watch("tags");

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue("tags", tags.filter((t: string) => t !== tagToRemove));
  };

  const onSubmit = (values: FormValues) => {
    const {
      representative_name,
      representative_position,
      representative_email,
      representative_phone,
      ...companyData
    } = values;

    const representative = representative_name
      ? {
          name: representative_name,
          position: representative_position || "",
          email: representative_email || undefined,
          phone: representative_phone || undefined,
        }
      : undefined;

    onAddCompany(
      {
        name: companyData.name,
        type: companyData.type,
        website: companyData.website || "",
        email: companyData.email || "",
        phone: companyData.phone || "",
        address: companyData.address || "",
        notes: companyData.notes || "",
        tags: companyData.tags,
      },
      representative,
    );
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-3xl font-geist">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">Добавить компанию</DialogTitle>
          <DialogDescription>
            Заполните информацию о новой организации и её представителе
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col max-h-[85vh]"
          >
            <ScrollArea className="px-6 py-4">
              <div className="space-y-6 pb-4">
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                    Основная информация
                  </h4>
                  <FormField
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название компании</FormLabel>
                        <FormControl>
                          <Input placeholder="ООО Название" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
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
                                <SelectValue placeholder="Выберите тип" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={CompanyType.CLIENT}>
                                Клиент
                              </SelectItem>
                              <SelectItem value={CompanyType.SUPPLIER}>
                                Поставщик
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Веб-сайт</FormLabel>
                          <FormControl>
                            <Input placeholder="example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email компании</FormLabel>
                          <FormControl>
                            <Input placeholder="office@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Телефон компании</FormLabel>
                          <FormControl>
                            <Input placeholder="+7..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={control}
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

                  <div className="space-y-3">
                    <FormLabel>Теги</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((t: string) => (
                        <div
                          key={t}
                          className="flex items-center bg-zinc-100 text-zinc-900 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="ml-2 hover:text-red-500 text-zinc-400"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Новый тег"
                        className="h-9 text-sm rounded-xl"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleAddTag}
                        className="rounded-xl h-9 px-4"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator className="bg-zinc-100" />

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">
                    Представитель (Контактное лицо)
                  </h4>
                  <FormField
                    control={control}
                    name="representative_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ф.И.О. представителя</FormLabel>
                        <FormControl>
                          <Input placeholder="Иванов Иван Иванович" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="representative_position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Должность</FormLabel>
                        <FormControl>
                          <Input placeholder="Руководитель отдела" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="representative_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Личный Email</FormLabel>
                          <FormControl>
                            <Input placeholder="ivan@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="representative_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Личный Телефон</FormLabel>
                          <FormControl>
                            <Input placeholder="+7..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator className="bg-zinc-100" />

                <FormField
                  control={control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Примечания</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Дополнительная информация о компании"
                          className="min-h-[100px] rounded-2xl resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <div className="p-6 bg-zinc-50 border-t border-zinc-100 flex justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="rounded-full px-6"
              >
                Отмена
              </Button>
              <Button type="submit" className="rounded-full px-8 bg-zinc-900 hover:bg-zinc-800 text-white">
                Добавить
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
