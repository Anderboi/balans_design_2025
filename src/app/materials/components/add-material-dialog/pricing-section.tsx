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
import { AddMaterialFormValues } from "@/lib/schemas/materials";

interface PricingSectionProps {
  control: Control<AddMaterialFormValues>;
  commonUnits: string[];
}

export function PricingSection({ control, commonUnits }: PricingSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0">
      <FormField
        control={control}
        name="price"
        render={({ field }) => (
          <FormRow label="Цена (₽)" htmlFor="price">
            <FormControl>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                {...field}
                onFocus={(e) => e.target.select()}
              />
            </FormControl>
          </FormRow>
        )}
      />

      <FormField
        control={control}
        name="unit"
        render={({ field }) => (
          <FormRow label="Единица измерения" htmlFor="unit">
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger id="unit">
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
          </FormRow>
        )}
      />
    </div>
  );
}
