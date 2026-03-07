"use client";

import { useState } from "react";
import { Task } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TaskLabelsPopoverProps {
  task: Task;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  trigger?: React.ReactNode;
}

export function TaskLabelsPopover({
  task,
  onUpdateTask,
  trigger,
}: TaskLabelsPopoverProps) {
  const [open, setOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const tags = task.tags || [];

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim() || tags.includes(newTag.trim())) return;

    const updatedTags = [...tags, newTag.trim()];
    if (onUpdateTask) {
      onUpdateTask(task.id, { tags: updatedTags });
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((t) => t !== tagToRemove);
    if (onUpdateTask) {
      onUpdateTask(task.id, { tags: updatedTags });
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs bg-zinc-50 border-zinc-200"
          >
            <Tag size={14} /> Метки
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <h4 className="font-semibold mb-3">Метки</h4>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.length === 0 && (
            <span className="text-zinc-500 text-sm">Нет меток</span>
          )}
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="px-2 py-1 pr-1 bg-zinc-100 text-zinc-800 hover:bg-zinc-200"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 rounded-full p-0.5 hover:bg-zinc-300 transition-colors"
              >
                <X size={12} />
              </button>
            </Badge>
          ))}
        </div>

        <form onSubmit={handleAddTag} className="space-y-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Создать новую метку"
            className="h-8 text-sm"
          />
          <Button
            type="submit"
            className="w-full h-8 text-xs bg-zinc-900 text-white"
            disabled={!newTag.trim()}
          >
            Добавить
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
