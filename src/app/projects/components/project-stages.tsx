"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  Loader2,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Types for stage configuration
type StageStatus = "completed" | "in_progress" | "locked";

interface StageItem {
  id: string;
  title: string;
  status: StageStatus;
  items: {
    id: string;
    title: string;
    completed: boolean;
    icon?: React.ElementType;
  }[];
  dueDate?: string;
  progress?: {
    current: number;
    total: number;
  };
}

const STAGES: StageItem[] = [
  {
    id: "preproject",
    title: "Предпроектная",
    status: "completed",
    items: [
      {
        id: "brief",
        title: "Техническое задание",
        completed: true,
        icon: FileText,
      },
      {
        id: "object_info",
        title: "Информация по объекту",
        completed: true,
        icon: FileText,
      },
      {
        id: "documents",
        title: "Документы",
        completed: true,
        icon: FileText,
      },
    ],
  },
  {
    id: "concept",
    title: "Концепция",
    status: "in_progress",
    dueDate: "15.11.2023",
    progress: { current: 2, total: 3 },
    items: [
      {
        id: "planning",
        title: "Планировочные решения",
        completed: true,
        icon: FileText,
      },
      {
        id: "collages",
        title: "Коллажи / Мудборды",
        completed: true,
        icon: FileText,
      },
      { id: "viz", title: "3D Визуализации", completed: false, icon: FileText },
    ],
  },
  {
    id: "working",
    title: "Рабочая",
    status: "locked",
    items: [
      { id: "drawings", title: "Чертежи", completed: false, icon: FileText },
      { id: "specs", title: "Спецификации", completed: false, icon: FileText },
    ],
  },
  {
    id: "realization",
    title: "Реализация",
    status: "locked",
    items: [
      {
        id: "supervision",
        title: "Авторский контроль",
        completed: false,
        icon: FileText,
      },
      {
        id: "procurement",
        title: "Комплектация",
        completed: false,
        icon: FileText,
      },
    ],
  },
];

export function ProjectStages() {
  // By default expand the 'in_progress' stage or the first one
  const [expandedStages, setExpandedStages] = useState<string[]>([
    "preproject",
    "concept",
  ]);

  const toggleStage = (id: string) => {
    setExpandedStages((prev) =>
      prev.includes(id)
        ? prev.filter((stageId) => stageId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="w-full space-y-6">
      <h2 className="text-lg font-semibold mb-4">Этапы работ</h2>

      <div className="space-y-4">
        {STAGES.map((stage) => {
          const isExpanded = expandedStages.includes(stage.id);
          const isLocked = stage.status === "locked";
          const isCompleted = stage.status === "completed";
          const isInProgress = stage.status === "in_progress";

          return (
            <div
              key={stage.id}
              className={cn(
                "rounded-3xl transition-all duration-300",
                isLocked
                  ? "opacity-60"
                  : "bg-white border border-gray-100 shadow-sm"
              )}
            >
              <div
                className={cn(
                  "p-6 flex items-center justify-between cursor-pointer",
                  !isLocked && "hover:bg-gray-50/50 rounded-3xl"
                )}
                onClick={() => !isLocked && toggleStage(stage.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-full shrink-0",
                      isCompleted
                        ? "bg-black text-white"
                        : isInProgress
                        ? "bg-gray-100"
                        : "bg-gray-50"
                    )}
                  >
                    {isCompleted && <Check className="w-6 h-6" />}
                    {isInProgress && (
                      <Loader2 className="w-6 h-6 //animate-spin text-gray-500" />
                    )}
                    {isLocked && <Lock className="w-5 h-5 text-gray-400" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-3">
                      <h3
                        className={cn(
                          "text-lg font-semibold",
                          isLocked ? "text-gray-400" : "text-gray-900"
                        )}
                      >
                        {stage.title}
                      </h3>
                      {isCompleted && (
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                          Этап завершен
                        </span>
                      )}
                      {isInProgress && (
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                          В работе
                        </span>
                      )}
                    </div>
                    {isInProgress && stage.dueDate && (
                      <p className="text-sm text-gray-500 mt-0.5">
                        Срок: {stage.dueDate}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {isInProgress && stage.progress && (
                    <div className="hidden sm:flex items-center gap-3 text-xs font-medium text-gray-400 uppercase tracking-widest">
                      <span>
                        {stage.progress.current} из {stage.progress.total}
                      </span>
                      <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="bg-black h-full rounded-full"
                          style={{
                            width: `${
                              (stage.progress.current / stage.progress.total) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {!isLocked && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Expandable Content */}
              {!isLocked && isExpanded && (
                <div className="px-6 pb-6 pt-0 space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <div className="h-px bg-gray-100 mb-4 mx-2" />
                  {stage.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-900">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            item.completed
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          )}
                        >
                          {item.icon ? (
                            <item.icon className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-medium text-sm">
                          {item.title}
                        </span>
                      </div>

                      {item.completed && (
                        <Check className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
