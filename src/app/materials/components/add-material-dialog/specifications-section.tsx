import { Control } from "react-hook-form";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormRow } from "@/components/ui/form-row";
import { AddMaterialFormValues } from "@/lib/schemas/materials";

interface SpecificationsSectionProps {
  control: Control<AddMaterialFormValues>;
}

export function SpecificationsSection({ control }: SpecificationsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="color"
        render={({ field }) => (
          <FormRow label="Цвет" htmlFor="color">
            <FormControl>
              <Input id="color" placeholder="Цвет материала" {...field} />
            </FormControl>
          </FormRow>
        )}
      />

      <FormField
        control={control}
        name="material"
        render={({ field }) => (
          <FormRow label="Материал" htmlFor="material">
            <FormControl>
              <Input id="material" placeholder="Материал" {...field} />
            </FormControl>
          </FormRow>
        )}
      />

      <FormField
        control={control}
        name="finish"
        render={({ field }) => (
          <FormRow label="Покрытие" htmlFor="finish">
            <FormControl>
              <Input id="finish" placeholder="Покрытие" {...field} />
            </FormControl>
          </FormRow>
        )}
      />

      <FormField
        control={control}
        name="size"
        render={({ field }) => (
          <FormRow label="Размер" htmlFor="size">
            <FormControl>
              <Input id="size" placeholder="Размер материала" {...field} />
            </FormControl>
          </FormRow>
        )}
      />
    </div>
  );
}
