import { Control } from "react-hook-form";
import { Plus, X } from "lucide-react";
import { FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormRow } from "@/components/ui/form-row";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddMaterialFormValues } from "@/lib/schemas/materials";

interface AdditionalInfoSectionProps {
  control: Control<AddMaterialFormValues>;
  tagInput: string;
  setTagInput: (value: string) => void;
  currentTags: string[];
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

export function AdditionalInfoSection({
  control,
  tagInput,
  setTagInput,
  currentTags,
  handleAddTag,
  handleRemoveTag,
  handleKeyPress,
}: AdditionalInfoSectionProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="product_url"
        render={({ field }) => (
          <FormRow label="URL продукта" htmlFor="product_url">
            <FormControl>
              <Input
                id="product_url"
                placeholder="https://example.com"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
          </FormRow>
        )}
      />

      <FormRow label="Теги" htmlFor="tag-input">
        <div className="flex gap-2 items-center">
          <Input
            id="tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Добавить тег"
            className="flex-1"
          />
          <Button
            type="button"
            onClick={handleAddTag}
            size="icon-lg"
            variant="outline"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        {currentTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {currentTags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </FormRow>
    </div>
  );
}
