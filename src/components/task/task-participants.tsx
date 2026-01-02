"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus as PlusIcon } from "lucide-react";
import { Participant } from "@/types";
import { ParticipantSelector } from "./participant-selector";

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
            <ParticipantSelector
              executor={executor}
              observers={observers}
              members={members}
              updateExecutor={updateExecutor}
              toggleObserver={toggleObserver}
              isSelected={isSelected}
              setObservers={setObservers}
              onClose={() => setOpenParticipants(false)}
              title="Участники задачи"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
