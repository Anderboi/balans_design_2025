import { Control } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AddMaterialFormValues } from "@/lib/schemas/materials";

interface DeliveryInfoSectionProps {
  control: Control<AddMaterialFormValues>;
}

export function DeliveryInfoSection({ control }: DeliveryInfoSectionProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="article"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Артикул</FormLabel>
              <FormControl>
                <Input placeholder="Артикул материала" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="lead_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Срок поставки (дней)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  {...field}
                  onFocus={(e) => e.target.select()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
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
