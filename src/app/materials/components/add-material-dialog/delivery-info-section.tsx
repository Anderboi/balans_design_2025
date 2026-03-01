import { Control } from "react-hook-form";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormRow } from "@/components/ui/form-row";
import { AddMaterialFormValues } from "@/lib/schemas/materials";

interface DeliveryInfoSectionProps {
  control: Control<AddMaterialFormValues>;
}

export function DeliveryInfoSection({ control }: DeliveryInfoSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-0">
        <FormField
          control={control}
          name="article"
          render={({ field }) => (
            <FormRow label="Артикул" htmlFor="article">
              <FormControl>
                <Input
                  id="article"
                  placeholder="Артикул материала"
                  {...field}
                />
              </FormControl>
            </FormRow>
          )}
        />

        <FormField
          control={control}
          name="lead_time"
          render={({ field }) => (
            <FormRow label="Срок поставки (дней)" htmlFor="lead_time">
              <FormControl>
                <Input
                  id="lead_time"
                  type="number"
                  min="0"
                  placeholder="0"
                  {...field}
                  onFocus={(e) => e.target.select()}
                />
              </FormControl>
            </FormRow>
          )}
        />
      </div>

      {/* <FormField
        control={control}
        name="in_stock"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormLabel className="font-normal">В наличии</FormLabel>
          </FormItem>
        )}
      /> */}
    </>
  );
}
