"use client";

import { useState, useRef, useEffect } from "react";
import { Task } from "@/types";
import { MessageSquare, Activity, Send, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TaskActivityProps {
  task: Task;
  onAddComment: (taskId: string, text: string) => void;
}

export function TaskActivity({ task, onAddComment }: TaskActivityProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");
  const [newComment, setNewComment] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [task.comments, activeTab]);

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onAddComment(task.id, newComment);
    setNewComment("");
  };

  return (
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
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {activeTab === "chat" ? (
          <>
            {task.comments?.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-400 gap-2 min-h-[200px]">
                <MessageSquare size={32} className="opacity-20" />
                <span className="text-xs">Нет сообщений</span>
              </div>
            ) : (
              <div className="space-y-4">
                {task.comments?.map((comment) => (
                  <div key={comment.id} className="flex gap-3 group">
                    <Avatar className="h-8 w-8 mt-1 border-2 border-white shadow-sm">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback className="text-[10px] bg-zinc-200">
                        {comment.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-zinc-900">
                          {comment.userName}
                        </span>
                        <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                          <Clock size={10} />
                          {new Date(comment.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-zinc-100 shadow-sm text-sm text-zinc-700 leading-relaxed">
                        {comment.text}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {task.history?.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs group">
                <div className="mt-1">
                  <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <Activity size={12} />
                  </div>
                </div>
                <div className="flex-1 pt-1.5 pb-2 border-b border-zinc-50">
                  <div className="flex justify-between mb-0.5">
                    <span className="font-medium text-zinc-900">
                      {item.userName}
                    </span>
                    <span className="text-zinc-400 text-[10px]">
                      {new Date(item.createdAt).toLocaleString("ru-RU", { 
                        day: "numeric", 
                        month: "short", 
                        hour: "2-digit", 
                        minute: "2-digit" 
                      })}
                    </span>
                  </div>
                  <div className="text-zinc-500">
                    {(() => {
                      const d = item.details || {};
                      if (item.action === "created") return "создал(а) задачу";
                      if (item.action === "status_changed") {
                        const statusLabels: Record<string, string> = {
                          "TODO": "К выполнению",
                          "IN_PROGRESS": "В процессе",
                          "REVIEW": "На проверке",
                          "DONE": "Выполнено"
                        };
                        return `изменил(а) статус на «${statusLabels[d.status] || d.status}»`;
                      }
                      
                      // Detailed updates
                      if (d.title) return `переименовал(а) задачу: «${d.title}»`;
                      if (d.description_changed) return "изменил(а) описание";
                      if (d.priority) return `изменил(а) приоритет на «${d.priority}»`;
                      if (d.due_date) return `изменил(а) срок на ${new Date(d.due_date).toLocaleDateString("ru-RU")}`;
                      if (d.assignee_changed) return "изменил(а) исполнителя";
                      
                      // Checklists & Items
                      if (d.checklist_added) return `добавил(а) чек-лист: «${d.checklist_added}»`;
                      if (d.checklist_renamed) return `переименовал(а) чек-лист на «${d.checklist_renamed}»`;
                      if (d.checklist_removed) return `удалил(а) чек-лист: «${d.checklist_removed}»`;
                      if (d.checklist_item_added) return `добавил(а) пункт: «${d.checklist_item_added}»`;
                      if (d.checklist_completed) return `отметил(а) выполненным: «${d.checklist_completed}»`;
                      if (d.checklist_uncompleted) return `снял(а) отметку: «${d.checklist_uncompleted}»`;
                      if (d.checklist_item_removed) return `удалил(а) пункт: «${d.checklist_item_removed}»`;
                      
                      return "обновил(а) задачу";
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area (Only for Chat) */}
      {activeTab === "chat" && (
        <div className="p-4 bg-white border-t border-zinc-200 sticky bottom-0">
          <form onSubmit={handleSubmitComment} className="relative">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Написать сообщение..."
              className="min-h-[80px] w-full resize-none bg-zinc-50 border-zinc-200 focus:bg-white pr-12 text-sm rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitComment(e);
                }
              }}
            />
            <Button
              size="icon"
              type="submit"
              disabled={!newComment.trim()}
              className="absolute bottom-3 right-3 h-8 w-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 transition-all"
            >
              <Send size={14} className="text-white" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
