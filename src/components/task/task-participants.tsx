"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus as PlusIcon, X, Search } from "lucide-react";
import { Participant } from "@/types";
import { cn } from "@/lib/utils/utils";

interface TaskParticipantsProps {
  executor: Participant | null;
  observers: Participant[];
  members: Participant[];
  updateExecutor: (id: string) => void;
  toggleObserver: (id: string) => void;
  isSelected: (id: string) => boolean;
  setObservers: (
    action: Participant[] | ((prev: Participant[]) => Participant[])
  ) => void;
}

export function TaskParticipants({
  executor,
  observers,
  members,
  updateExecutor,
  toggleObserver,
  isSelected,
  setObservers,
}: TaskParticipantsProps) {
  const [openParticipants, setOpenParticipants] = useState(false);

  return (
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

        <Popover open={openParticipants} onOpenChange={setOpenParticipants}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-full border-dashed bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 transition-all"
            >
              <PlusIcon size={18} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-[320px]" align="start">
            <div className="p-3 border-b border-zinc-100 flex items-center justify-between">
              <span className="text-sm font-semibold">Участники задачи</span>
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

              {/* Current Participants Section */}
              {(executor || observers.length > 0) && (
                <div className="mb-4">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-2 mb-1">
                    Участники
                  </h4>
                  <div className="space-y-0.5">
                    {[executor, ...observers].filter(Boolean).map((p) => {
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
                                isExec ? "border-blue-500" : "border-white"
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
                                {isExec ? "Исполнитель" : "Наблюдатель"}
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
                                if (isExec) updateExecutor("");
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
              )}

              {/* Available Members Section */}
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-zinc-400 px-2 mb-1">
                  Другие участники
                </h4>
                <div className="space-y-0.5">
                  {members.filter((m) => !isSelected(m.id)).length === 0 ? (
                    <div className="text-xs text-zinc-400 text-center py-4">
                      Все участники уже добавлены
                    </div>
                  ) : (
                    members
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
                      ))
                  )}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
