"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trash2, UserPlus, Check, ChevronsUpDown } from "lucide-react";
import { toast } from "sonner";
import {
  addProjectMember,
  removeProjectMember,
  searchProfiles,
  inviteUser,
  ProjectRole,
} from "@/lib/actions/team";
import { cn } from "@/lib/utils";

interface Member {
  id: string;
  role: ProjectRole;
  user: {
    id: string;
    full_name: string | null;
    email: string | null;
    avatar_url: string | null;
  };
}

interface SearchResult {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
}

interface TeamManagementProps {
  projectId: string;
  initialMembers: Member[];
}

const ROLES: { value: ProjectRole; label: string }[] = [
  { value: "owner", label: "Владелец" },
  { value: "lead_designer", label: "Ведущий дизайнер" },
  { value: "designer", label: "Дизайнер" },
  { value: "project_manager", label: "Менеджер проектов" },
  { value: "client", label: "Клиент" },
];

export function TeamManagement({
  projectId,
  initialMembers,
}: TeamManagementProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [role, setRole] = useState<ProjectRole>("designer");
  const [isLoading, setIsLoading] = useState(false);

  // Search/Combobox state
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        const results = await searchProfiles(query);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleAddMember = async () => {
    console.log("handleAddMember called", { projectId, selectedEmail, role });
    if (!selectedEmail) {
      console.log("No email selected");
      return;
    }

    setIsLoading(true);
    try {
      const result = await addProjectMember(projectId, selectedEmail, role);
      console.log("addProjectMember result:", result);
      if (result.success) {
        toast.success("Участник успешно добавлен");
        setIsInviteOpen(false);
        setSelectedEmail("");
        setQuery("");
        window.location.reload();
      } else {
        toast.error(result.error || "Не удалось добавить участника");
      }
    } catch (error) {
      console.error("handleAddMember error:", error);
      toast.error("Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!query || !query.includes("@")) {
      toast.error("Введите корректный email для приглашения");
      return;
    }

    setIsLoading(true);
    try {
      const result = await inviteUser(projectId, query, role);
      if (result.success) {
        toast.success((result as any).message || "Приглашение отправлено");
        setIsInviteOpen(false);
        setSelectedEmail("");
        setQuery("");
        window.location.reload();
      } else {
        toast.error((result as any).error || "Ошибка приглашения");
      }
    } catch (error) {
      console.error(error);
      toast.error("Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!confirm("Вы уверены, что хотите удалить этого участника?")) return;

    try {
      const result = await removeProjectMember(projectId, userId);
      if (result.success) {
        toast.success("Участник удален");
        setMembers(members.filter((m) => m.user.id !== userId));
      } else {
        toast.error(result.error || "Не удалось удалить участника");
      }
    } catch (error) {
      console.error(error);
      toast.error("Произошла ошибка");
    }
  };

  const getRoleLabel = (roleValue: string) => {
    return ROLES.find((r) => r.value === roleValue)?.label || roleValue;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Команда проекта</h3>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="mr-2 h-4 w-4" />
              Добавить участника
            </Button>
          </DialogTrigger>
          <DialogContent className="overflow-visible">
            <DialogHeader>
              <DialogTitle>Добавить участника</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Пользователь</label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {selectedEmail || "Поиск по имени или email..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Поиск..."
                        value={query}
                        onValueChange={setQuery}
                      />
                      <CommandList>
                        {isSearching && (
                          <div className="py-6 text-center text-sm text-muted-foreground">
                            Поиск...
                          </div>
                        )}
                        {!isSearching &&
                          searchResults.length === 0 &&
                          query.length >= 2 && (
                            <CommandEmpty>
                              <div className="p-2 flex flex-col gap-2">
                                <p className="text-sm text-muted-foreground">
                                  Пользователь не найден
                                </p>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="w-full"
                                  onClick={handleInvite}
                                >
                                  Пригласить {query}
                                </Button>
                              </div>
                            </CommandEmpty>
                          )}
                        <CommandGroup heading="Пользователи">
                          {searchResults.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.email || ""}
                              onSelect={() => {
                                setSelectedEmail(user.email || "");
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedEmail === user.email
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <Avatar className="mr-2 h-6 w-6">
                                <AvatarImage
                                  src={user.avatar_url || undefined}
                                />
                                <AvatarFallback>
                                  {user.full_name?.[0] || user.email?.[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span>{user.full_name || "Без имени"}</span>
                                <span className="text-xs text-muted-foreground">
                                  {user.email}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Роль</label>
                <Select
                  value={role}
                  onValueChange={(v) => setRole(v as ProjectRole)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={handleAddMember}
                disabled={isLoading || !selectedEmail}
              >
                {isLoading ? "Добавление..." : "Добавить"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={member.user.avatar_url || undefined} />
                <AvatarFallback>
                  {member.user.full_name?.[0] || member.user.email?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">
                  {member.user.full_name || "Пользователь"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.user.email}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                {getRoleLabel(member.role)}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive/90"
                onClick={() => handleRemoveMember(member.user.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            В этом проекте пока нет других участников.
          </div>
        )}
      </div>
    </div>
  );
}
