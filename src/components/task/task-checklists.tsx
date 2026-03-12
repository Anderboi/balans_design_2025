"use client";

import { useState } from "react";
import { Task, TaskChecklistItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { tasksService } from "@/lib/services/tasks";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskChecklistsProps {
  task: Task;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
}

export function TaskChecklists({ task, onUpdateTask }: TaskChecklistsProps) {
  const [addingChecklist, setAddingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState("");
  const [addingItemTo, setAddingItemTo] = useState<string | null>(null);
  const [newItemTitle, setNewItemTitle] = useState("");

  const handleAddChecklist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistTitle.trim()) return;

    const newChecklist = await tasksService.createChecklist(
      task.id,
      newChecklistTitle.trim(),
      task.checklists?.length || 0
    );
    
    if (onUpdateTask) {
      onUpdateTask(task.id, { 
        checklists: [...(task.checklists || []), newChecklist] 
      });
    }

    setNewChecklistTitle("");
    setAddingChecklist(false);
  };

  const handleAddItem = async (e: React.FormEvent, checklistId: string, itemsCount: number) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    const newItem = await tasksService.createChecklistItem(
      checklistId,
      newItemTitle.trim(),
      itemsCount
    );

    if (onUpdateTask && task.checklists) {
      const updatedChecklists = task.checklists.map((c) => 
        c.id === checklistId ? { ...c, items: [...(c.items || []), newItem] } : c
      );
      onUpdateTask(task.id, { checklists: updatedChecklists });
    }

    setNewItemTitle("");
    setAddingItemTo(null);
  };

  const toggleItem = async (checklistId: string, item: TaskChecklistItem) => {
    const updatedStatus = !item.is_completed;
    
    await tasksService.updateChecklistItem(item.id, {
      is_completed: updatedStatus,
    });

    if (onUpdateTask && task.checklists) {
      const updatedChecklists = task.checklists.map((c) => 
        c.id === checklistId 
          ? { ...c, items: (c.items || []).map(i => i.id === item.id ? { ...i, is_completed: updatedStatus } : i) } 
          : c
      );
      onUpdateTask(task.id, { checklists: updatedChecklists as any[] });
    }
  };

  const deleteChecklist = async (id: string) => {
    await tasksService.deleteChecklist(id);

    if (onUpdateTask && task.checklists) {
      onUpdateTask(task.id, { 
        checklists: task.checklists.filter(c => c.id !== id) 
      });
    }
  };

  const deleteItem = async (checklistId: string, itemId: string) => {
    await tasksService.deleteChecklistItem(itemId);

    if (onUpdateTask && task.checklists) {
      const updatedChecklists = task.checklists.map((c) => 
        c.id === checklistId 
          ? { ...c, items: (c.items || []).filter(i => i.id !== itemId) } 
          : c
      );
      onUpdateTask(task.id, { checklists: updatedChecklists as any[] });
    }
  };

  if (!task.checklists?.length && !addingChecklist) {
    return (
      <div className="flex items-center gap-2 mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAddingChecklist(true)}
          className="h-8 gap-1.5 text-xs bg-zinc-50 border-zinc-200"
        >
          <CheckSquare size={14} /> Добавить чек-лист
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-8">
      {task.checklists?.map((checklist) => {
        const items = checklist.items || [];
        const completedCount = items.filter((i) => i.is_completed).length;
        const progress = items.length === 0 ? 0 : Math.round((completedCount / items.length) * 100);

        return (
          <div key={checklist.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold">
                <CheckSquare size={18} className="text-zinc-500" />
                {checklist.title}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteChecklist(checklist.id)}
                className="h-6 px-2 text-zinc-400 hover:text-red-600 hover:bg-red-50"
              >
                Удалить
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-500 w-8">{progress}%</span>
              <div className="h-2 flex-1 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-zinc-900 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 group"
                >
                  <Checkbox
                    checked={item.is_completed}
                    onCheckedChange={() => toggleItem(checklist.id, item)}
                    className="mt-1"
                  />
                  <span
                    className={`flex-1 text-sm pt-0.5 ${
                      item.is_completed ? "text-zinc-400 line-through" : "text-zinc-700"
                    }`}
                  >
                    {item.title}
                  </span>
                  <button
                    onClick={() => deleteItem(checklist.id, item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-red-500 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {addingItemTo === checklist.id ? (
              <form
                onSubmit={(e) => handleAddItem(e, checklist.id, items.length)}
                className="mt-3 space-y-2 ml-7"
              >
                <Input
                  autoFocus
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  placeholder="Добавить элемент"
                  className="h-8 text-sm"
                />
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="h-7 text-xs">
                    Добавить
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => {
                      setAddingItemTo(null);
                      setNewItemTitle("");
                    }}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1.5 text-xs text-zinc-500 ml-5"
                onClick={() => setAddingItemTo(checklist.id)}
              >
                <Plus size={14} /> Добавить элемент
              </Button>
            )}
          </div>
        );
      })}

      {addingChecklist ? (
        <form onSubmit={handleAddChecklist} className="space-y-3 bg-zinc-50 p-4 rounded-lg border border-zinc-100">
          <Input
            autoFocus
            value={newChecklistTitle}
            onChange={(e) => setNewChecklistTitle(e.target.value)}
            placeholder="Название чек-листа"
            className="h-9"
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="h-8" disabled={!newChecklistTitle.trim()}>
              Добавить
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8"
              onClick={() => {
                setAddingChecklist(false);
                setNewChecklistTitle("");
              }}
            >
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAddingChecklist(true)}
          className="h-8 gap-1.5 text-xs bg-zinc-50 border-zinc-200 mt-4"
        >
          <CheckSquare size={14} /> Добавить чек-лист
        </Button>
      )}
    </div>
  );
}
