import { Control } from "react-hook-form";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormRow } from "@/components/ui/form-row";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MaterialType } from "@/types";
import { AddMaterialFormValues } from "@/lib/schemas/materials";

interface BasicInfoSectionProps {
  control: Control<AddMaterialFormValues>;
  materialTypes: MaterialType[];
}

export function BasicInfoSection({
  control,
  materialTypes,
}: BasicInfoSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0">
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormRow label="Наименование" htmlFor="name" required>
            <FormControl>
              <Input
                id="name"
                placeholder="Наименование материала"
                {...field}
              />
            </FormControl>
          </FormRow>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormRow label="Категория" htmlFor="type" required>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger id="type">
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
          </FormRow>
        )}
      />

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormRow label="Описание" htmlFor="description">
            <FormControl>
              <Input
                id="description"
                placeholder="Описание материала"
                {...field}
              />
            </FormControl>
          </FormRow>
        )}
      />

      <FormField
        control={control}
        name="manufacturer"
        render={({ field }) => (
          <FormRow label="Производитель" htmlFor="manufacturer">
            <FormControl>
              <Input
                id="manufacturer"
                placeholder="Название производителя"
                {...field}
              />
            </FormControl>
          </FormRow>
        )}
      />
    </div>
  );
}
