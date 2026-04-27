import { useState } from "react";
import {
  UseFormSetValue,
  UseFormWatch,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

interface UseTagManagementProps<T extends FieldValues> {
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
}

export function useTagManagement<T extends FieldValues & { tags: string[] }>({
  setValue,
  watch,
}: UseTagManagementProps<T>) {
  const [tagInput, setTagInput] = useState("");
  const currentTags = (watch("tags" as Path<T>) || []) as string[];

  const handleAddTag = () => {
    if (tagInput.trim() && !currentTags.includes(tagInput.trim())) {
      setValue(
        "tags" as Path<T>,
        [...currentTags, tagInput.trim()] as PathValue<T, Path<T>>
      );
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags" as Path<T>,
      currentTags.filter((tag: any) => tag !== tagToRemove) as PathValue<
        T,
        Path<T>
      >
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const resetTags = () => {
    setTagInput("");
  };

  return {
    tagInput,
    setTagInput,
    currentTags,
    handleAddTag,
    handleRemoveTag,
    handleKeyPress,
    resetTags,
  };
}
