"use client";

import React, { useState, useRef, useEffect } from "react";
import { Task, Participant } from "@/types";
import { tasksService } from "@/lib/services/tasks";
import { toast } from "sonner";
import {
  X,
  Calendar,
  Send,
  Clock,
  Activity,
  MessageSquare,
  Plus as PlusIcon,
  UploadCloud,
  File as FileIcon,
  Trash2,
  Image as ImageIcon,
  Search,
  UserPlus,
  Tag,
  CheckSquare,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

interface TaskDetailsDialogProps {
  children?: React.ReactNode;
  task: Task;
  onOpenChange?: (open: boolean) => void;
  // Mock props
  onAddComment?: (taskId: string, text: string) => void;
  onUpdateTask?: (taskId: string, updates: Partial<Task>) => void;
  members?: Participant[];
}

export function TaskDetailsDialog({
  children,
  task,
  onOpenChange,
  onAddComment = (id, text) => console.log("Add comment:", id, text),
  onUpdateTask = (id, updates) => console.log("Update task:", id, updates),
  members = [],
}: TaskDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");
  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState<
    import("@/types").TaskAttachment[]
  >(task.attachments || []);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [openParticipants, setOpenParticipants] = useState(false);
  const [executor, setExecutor] = useState<Participant | null>(() => {
    if (task.assigned_to) {
      return members.find((m) => m.id === task.assigned_to) || null;
    }
    return null;
  });
  const [observers, setObservers] = useState<Participant[]>(
    task.observers || []
  );
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state with props
  useEffect(() => {
    if (task.assigned_to) {
      setExecutor(members.find((m) => m.id === task.assigned_to) || null);
    } else {
      setExecutor(null);
    }
    setObservers(task.observers || []);
    setDescription(task.description || "");
    setAttachments(task.attachments || []);
  }, [
    task.assigned_to,
    task.observers,
    members,
    task.description,
    task.attachments,
  ]);

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) {
      setIsDragging(true);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      await uploadFiles(droppedFiles);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      await uploadFiles(selectedFiles);
    }
  };

  const uploadFiles = async (filesToUpload: File[]) => {
    setIsUploading(true);
    try {
      for (const file of filesToUpload) {
        const newAttachment = await tasksService.uploadAttachment(
          task.id,
          file
        );
        setAttachments((prev) => [...prev, newAttachment]);
      }
      toast.success(
        filesToUpload.length === 1 ? "Файл загружен" : "Файлы загружены"
      );
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Ошибка при загрузке файлов");
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = async (attachmentId: string, fileUrl: string) => {
    try {
      await tasksService.deleteAttachment(attachmentId, fileUrl);
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
      toast.success("Вложение удалено");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Ошибка при удалении вложения");
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  // Participant handlers
  const toggleObserver = async (id: string) => {
    const isObserver = observers.some((o) => o.id === id);
    try {
      if (isObserver) {
        const newObservers = observers.filter((o) => o.id !== id);
        setObservers(newObservers);
        await tasksService.removeParticipant(task.id, id);
        onUpdateTask(task.id, { observers: newObservers });
      } else {
        const member = members.find((m) => m.id === id);
        if (member) {
          const newObservers = [...observers, member];
          setObservers(newObservers);
          await tasksService.addParticipant(task.id, id);
          onUpdateTask(task.id, { observers: newObservers });
        }
      }
    } catch (error) {
      console.error("Failed to update observer:", error);
      toast.error("Не удалось обновить участника");
    }
  };

  const updateExecutor = async (id: string) => {
    try {
      const member = members.find((m) => m.id === id);
      const updates = { assigned_to: id || null };

      // Optimistic
      setExecutor(member || null);
      onUpdateTask(task.id, updates);

      await tasksService.updateTask(task.id, updates);
      toast.success("Исполнитель обновлен");
    } catch (error) {
      console.error("Failed to update executor:", error);
      toast.error("Не удалось обновить исполнителя");
    }
  };

  const isSelected = (id: string) => {
    return executor?.id === id || observers.some((o) => o.id === id);
  };

  const handleDescriptionSave = async () => {
    try {
      // Optimistic update
      onUpdateTask(task.id, { description });
      setIsEditingDescription(false);

      await tasksService.updateTask(task.id, { description });
      toast.success("Описание обновлено");
    } catch (error) {
      console.error("Failed to update description:", error);
      toast.error("Не удалось обновить описание");
    }
  };

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [task.comments, activeTab]);

  useEffect(() => {
    if (task.assigned_to) {
      const member = members.find((m) => m.id === task.assigned_to);
      setExecutor(member || null);
    } else {
      setExecutor(null);
    }
  }, [task.assigned_to, members]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(task.id, newComment);
    setNewComment("");
  };

  const getPriorityColor = (priority?: string) => {
    switch (
      priority // Map Russian values if needed, or English
    ) {
      case "Высокий":
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "Средний":
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Низкий":
      case "low":
        return "bg-zinc-100 text-zinc-600 border-zinc-200";
      default:
        return "bg-zinc-100 text-zinc-600 border-zinc-200";
    }
  };

  const getStatusLabel = (status: string) => {
    // Basic mapping or direct return
    // Assuming status might be 'TODO', 'IN_PROGRESS' etc from type or user's strings
    switch (status) {
      case "TODO":
        return "К выполнению";
      case "IN_PROGRESS":
        return "В работе";
      case "REVIEW":
        return "Согласование";
      case "DONE":
        return "Готово";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-zinc-100 text-zinc-600";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "REVIEW":
        return "bg-purple-100 text-purple-700";
      case "DONE":
        return "bg-green-100 text-green-700";
      default:
        return "bg-zinc-100 text-zinc-600";
    }
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent className="w-full max-w-[1024px]! h-[85vh]! p-0 gap-0 overflow-hidden flex flex-col md:flex-row bg-[#fbfbfd] border-zinc-200 shadow-2xl sm:rounded-2xl">
        {/* Left Column: Task Details */}
        <div className="flex-1 flex flex-col //min-w-0 bg-white border-r border-zinc-200 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="p-8 pb-4">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {task.priority && (
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    )}
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                </div>

                <DialogTitle className="text-2xl font-semibold text-zinc-900 leading-tight">
                  {task.title}
                </DialogTitle>

                {/* Action Buttons from Screenshot */}
                <div className="flex items-center gap-1.5 capitalize">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs bg-zinc-50 border-zinc-200"
                  >
                    <PlusIcon size={14} /> Добавить
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs bg-zinc-50 border-zinc-200"
                  >
                    <Tag size={14} /> Метки
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs bg-zinc-50 border-zinc-200"
                  >
                    <Calendar size={14} /> Даты
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs bg-zinc-50 border-zinc-200"
                  >
                    <CheckSquare size={14} /> Чек-лист
                  </Button>

                  <Popover
                    open={openParticipants}
                    onOpenChange={setOpenParticipants}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 gap-1.5 text-xs bg-zinc-800 text-white hover:bg-zinc-700"
                      >
                        <UserPlus size={14} /> Исполнитель
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[320px]" align="end">
                      <div className="p-3 border-b border-zinc-100 flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          Исполнитель
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => setOpenParticipants(false)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                      <div className="p-2">
                        <div className="relative mb-2">
                          <Search
                            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400"
                            size={14}
                          />
                          <input
                            placeholder="Поиск участников"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-300"
                          />
                        </div>

                        {/* Card Participants Section */}
                        <div className="mb-4">
                          <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-2 mb-1">
                            Участники
                          </h4>
                          <div className="space-y-0.5">
                            {[executor, ...observers]
                              .filter(Boolean)
                              .map((p) => {
                                const isExec = p!.id === executor?.id;
                                return (
                                  <div
                                    key={p!.id}
                                    className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-100 group transition-colors"
                                  >
                                    <div className="flex items-center gap-2">
                                      <Avatar
                                        className={cn(
                                          "h-7 w-7 border-2 shadow-sm",
                                          isExec
                                            ? "border-blue-500"
                                            : "border-white"
                                        )}
                                      >
                                        <AvatarImage src={p!.avatar} />
                                        <AvatarFallback className="text-[10px] bg-zinc-200">
                                          {p!.name.charAt(0)}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex flex-col gap-0.5">
                                        <span className="text-sm text-zinc-700 leading-tight">
                                          {p!.name}
                                        </span>
                                        <span className="text-[10px] text-zinc-400 font-medium">
                                          {isExec
                                            ? "Исполнитель"
                                            : "Наблюдатель"}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {!isExec && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 px-2 text-[10px] text-blue-600 hover:bg-blue-50"
                                          onClick={() => {
                                            updateExecutor(p!.id);
                                            setObservers((prev) =>
                                              prev.filter((o) => o.id !== p!.id)
                                            );
                                          }}
                                        >
                                          Сделать исп.
                                        </Button>
                                      )}
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-zinc-400 hover:text-red-500"
                                        onClick={() => {
                                          if (isExec) setExecutor(null);
                                          else toggleObserver(p!.id);
                                        }}
                                      >
                                        <X size={14} />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        {/* Board Participants Section */}
                        <div>
                          <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-2 mb-1">
                            Другие участники
                          </h4>
                          <div className="space-y-0.5">
                            {members
                              .filter((m) => !isSelected(m.id))
                              .map((member) => (
                                <div
                                  key={member.id}
                                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-50 cursor-pointer group"
                                  onClick={() => toggleObserver(member.id)}
                                >
                                  <Avatar className="h-7 w-7 border border-white shadow-sm ring-1 ring-zinc-100">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback className="text-[10px] bg-amber-500 text-white font-bold">
                                      {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-zinc-700">
                                    {member.name}
                                  </span>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Avatars Row - Participants */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-0.5">
                    Исполнитель
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {executor && (
                      <div
                        className="relative group cursor-pointer"
                        title={`Исполнитель: ${executor.name}`}
                      >
                        <Avatar className="h-9 w-9 ring-2 ring-blue-100 border-2 border-white shadow-sm">
                          <AvatarImage src={executor.avatar} />
                          <AvatarFallback className="text-xs bg-zinc-200">
                            {executor.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-[8px] text-white px-1 rounded shadow-sm border border-white">
                          ИС
                        </div>
                      </div>
                    )}
                    {observers.map((p) => (
                      <Avatar
                        key={p.id}
                        className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-zinc-100 cursor-pointer hover:scale-105 transition-transform"
                        title={`Наблюдатель: ${p.name}`}
                      >
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback className="text-xs bg-zinc-100">
                          {p.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-full border-dashed bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-all"
                      onClick={() => setOpenParticipants(true)}
                    >
                      <PlusIcon size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm text-zinc-500 mt-6 px-0">
              {/* Due Date and other details can go here or be omitted to match screenshot */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 leading-tight mb-0.5">
                    Срок
                  </div>
                  <div className="font-medium text-zinc-900">
                    {task.due_date
                      ? new Date(task.due_date).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "long",
                        })
                      : "Не указан"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-zinc-100 mx-8" />

          <div className="p-8 pt-6 space-y-6 flex-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Описание
                </h3>
                {!isEditingDescription && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition-colors"
                    onClick={() => setIsEditingDescription(true)}
                  >
                    Изменить
                  </Button>
                )}
              </div>

              {isEditingDescription ? (
                <div className="space-y-3">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Добавьте более подробное описание..."
                    className="min-h-[120px] text-sm bg-zinc-50/50 border-zinc-200 focus:bg-white transition-all resize-none p-4 rounded-xl leading-relaxed"
                    autoFocus
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={handleDescriptionSave}
                      className="rounded-lg px-4"
                    >
                      Сохранить
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setIsEditingDescription(false);
                        setDescription(task.description || "");
                      }}
                      className="rounded-lg px-4 text-zinc-500"
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-600 text-sm leading-relaxed whitespace-pre-line">
                  {description || (
                    <span className="text-zinc-400 italic">
                      Описание отсутствует.
                    </span>
                  )}
                </p>
              )}
            </div>

            {/* Attachments */}
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 mb-3">
                Вложения
              </h3>
              <div
                className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group relative overflow-hidden ${
                  isDragging
                    ? "border-blue-500 bg-blue-50/50"
                    : isUploading
                    ? "border-zinc-200 bg-zinc-50 cursor-wait"
                    : "border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={isUploading ? undefined : openFileDialog}
              >
                <input
                  type="file"
                  multiple
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  disabled={isUploading}
                />

                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isDragging
                      ? "bg-blue-100 text-blue-600 shadow-sm scale-110"
                      : "bg-zinc-100 text-zinc-400 group-hover:bg-white group-hover:shadow-sm"
                  }`}
                >
                  {isUploading ? (
                    <Loader2 size={20} className="animate-spin text-zinc-400" />
                  ) : isDragging ? (
                    <UploadCloud size={20} />
                  ) : (
                    <PlusIcon size={20} />
                  )}
                </div>
                <span
                  className={`text-xs transition-colors ${
                    isDragging ? "text-blue-600 font-medium" : "text-zinc-400"
                  }`}
                >
                  {isUploading
                    ? "Загрузка..."
                    : isDragging
                    ? "Отпустите файлы для загрузки"
                    : "Нажмите или перетащите файлы"}
                </span>

                {(isDragging || isUploading) && (
                  <div
                    className={`absolute inset-0 pointer-events-none ${
                      isDragging
                        ? "bg-blue-500/5 backdrop-blur-[1px]"
                        : "bg-white/10"
                    }`}
                  />
                )}
              </div>

              {/* Uploaded Files List */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="group flex items-center gap-3 p-2 rounded-lg border border-zinc-100 bg-white hover:border-zinc-200 shadow-sm transition-all"
                    >
                      <a
                        href={attachment.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center gap-3 min-w-0"
                      >
                        <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center shrink-0 border border-zinc-100 text-zinc-400">
                          {attachment.file_type?.startsWith("image/") ? (
                            <ImageIcon size={14} />
                          ) : (
                            <FileIcon size={14} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-xs font-medium text-zinc-700 truncate">
                            {attachment.file_name}
                          </div>
                          <div className="text-[10px] text-zinc-400">
                            {attachment.file_size
                              ? (attachment.file_size / 1024).toFixed(1)
                              : "?"}{" "}
                            KB
                          </div>
                        </div>
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeAttachment(attachment.id, attachment.file_url);
                        }}
                        className="p-1.5 rounded-md text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity (Chat & History) */}
        <div className="w-full md:w-[400px] bg-[#fbfbfd] flex flex-col border-l border-zinc-200">
          {/* Header / Tabs */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex bg-zinc-100/80 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "chat"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                <MessageSquare size={14} />
                Чат
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
                  activeTab === "history"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                }`}
              >
                <Activity size={14} />
                История
              </button>
            </div>
            {/* Close button handled by Dialog primitive usually, but we can hide default X and use this? 
                  DialogContent usually has a X close. We can override or hide it. 
                  Shadcn DialogContent automatically adds a Close X. 
                  We'll let it be or hide and use ours if needed. 
                  Actually, Shadcn's Close is absolute. We can hide it via CSS if we want custom placement. 
              */}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {/* CHAT TAB */}
            {activeTab === "chat" && (
              <div className="space-y-4 pb-4">
                {task.comments && task.comments.length > 0 ? (
                  task.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-3 animate-fade-in"
                    >
                      <Image
                        src={
                          comment.userAvatar ||
                          `https://ui-avatars.com/api/?name=${comment.userName}&background=random`
                        }
                        alt=""
                        className="w-8 h-8 rounded-full bg-zinc-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xs font-bold text-zinc-900">
                            {comment.userName}
                          </span>
                          <span className="text-[10px] text-zinc-400">
                            {new Date(comment.createdAt).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-zinc-200 shadow-sm text-sm text-zinc-700">
                          {comment.text}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-40 flex flex-col items-center justify-center text-zinc-400 text-sm">
                    <MessageSquare size={24} className="mb-2 opacity-20" />
                    <p>Нет комментариев</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
              <div className="space-y-6 pl-2 pt-2">
                {task.history && task.history.length > 0 ? (
                  task.history.map((item, idx) => (
                    <div
                      key={item.id}
                      className="relative pl-6 pb-2 last:pb-0 animate-fade-in"
                    >
                      {/* Line */}
                      {idx !== (task.history?.length || 0) - 1 && (
                        <div className="absolute left-[5px] top-2 bottom-0 w-px bg-zinc-200" />
                      )}
                      {/* Dot */}
                      <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white bg-zinc-300 ring-1 ring-zinc-100" />

                      <div className="text-sm">
                        <span className="font-medium text-zinc-900">
                          {item.userName}
                        </span>
                        <span className="text-zinc-600"> {item.action}</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(item.createdAt).toLocaleString("ru-RU", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-zinc-400 text-sm py-8">
                    История изменений пуста
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area (Only for Chat) */}
          {activeTab === "chat" && (
            <div className="p-4 bg-white border-t border-zinc-200">
              <form onSubmit={handleSubmitComment} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Написать комментарий..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-white focus:border-zinc-400 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="bg-black text-white p-2.5 rounded-xl hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
