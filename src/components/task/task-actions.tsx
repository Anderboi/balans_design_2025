import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { UserPlus, PlusIcon, Tag, Calendar, CheckSquare } from "lucide-react";
import { Participant } from "@/types";
import { ParticipantSelector } from "./participant-selector";

interface TaskActionsProps {
  members: Participant[];
  executor: Participant | null;
  observers: Participant[];
  openParticipants: boolean;
  setOpenParticipants: (open: boolean) => void;
  updateExecutor: (id: string) => void;
  toggleObserver: (id: string) => void;
  isSelected: (id: string) => boolean;
  setObservers: React.Dispatch<React.SetStateAction<Participant[]>>;
}

const taskHeaderButtons = [
  {
    label: "Добавить",
    icon: PlusIcon,
    onClick: () => {},
  },
  {
    label: "Метки",
    icon: Tag,
    onClick: () => {},
  },
  {
    label: "Даты",
    icon: Calendar,
    onClick: () => {},
  },
  {
    label: "Чек-лист",
    icon: CheckSquare,
    onClick: () => {},
  },
];

export function TaskActions({
  members,
  executor,
  observers,
  openParticipants,
  setOpenParticipants,
  updateExecutor,
  toggleObserver,
  isSelected,
  setObservers,
}: TaskActionsProps) {
  return (
    <div className="flex items-center gap-1.5 capitalize">
      {/* trello style buttons */}
      <div className="flex items-center gap-1.5 capitalize">
        {taskHeaderButtons.map((button) => (
          <Button
            key={button.label}
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs bg-zinc-50 border-zinc-200"
            onClick={button.onClick}
          >
            <button.icon size={14} /> {button.label}
          </Button>
        ))}
      </div>
      <Popover open={openParticipants} onOpenChange={setOpenParticipants}>
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
          <ParticipantSelector
            executor={executor}
            observers={observers}
            members={members}
            updateExecutor={updateExecutor}
            toggleObserver={toggleObserver}
            isSelected={isSelected}
            setObservers={setObservers}
            onClose={() => setOpenParticipants(false)}
            title="Исполнитель"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
