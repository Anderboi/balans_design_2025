import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AddMaterialFormValues } from "@/lib/schemas/materials";

interface SpecificationsSectionProps {
  control: Control<AddMaterialFormValues>;
}

export function SpecificationsSection({ control }: SpecificationsSectionProps) {
  return (
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
  );
}
