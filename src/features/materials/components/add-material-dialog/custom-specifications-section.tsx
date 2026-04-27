"use client";

import { Control, useFieldArray } from "react-hook-form";
import { AddMaterialFormValues } from "@/lib/schemas/materials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
// import { Reorder } from "framer-motion";

interface CustomSpecificationsSectionProps {
  control: Control<AddMaterialFormValues>;
}

export function CustomSpecificationsSection({
  control,
}: CustomSpecificationsSectionProps) {
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "custom_specifications",
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2 items-start group">
            <div className="mt-3 cursor-grab opacity-50 hover:opacity-100 flex-shrink-0">
              <GripVertical className="h-4 w-4" />
            </div>

            <FormField
              control={control}
              name={`custom_specifications.${index}.label`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Название (например: Тип лампы)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`custom_specifications.${index}.value`}
              render={({ field }) => (
                <FormItem className="flex-2">
                  <FormControl>
                    <Input placeholder="Значение (например: LED)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="mt-0 opacity-50 hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => remove(index)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full border-dashed"
        onClick={() => append({ label: "", value: "" })}
      >
        <Plus className="size-4 mr-2" />
        Добавить характеристику
      </Button>
    </div>
  );
}
