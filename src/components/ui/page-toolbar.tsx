"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Поиск...",
  children,
  className,
}: PageToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-row gap-2 sm:gap-4 items-center justify-between bg-background p-2 rounded-full shadow-lg shadow-zinc-300/50",
        className
      )}
    >
      <div className="relative grow sm:w-96 group">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => onSearchChange("")}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <div className="flex items-center sm:w-full md:w-auto overflow-x-auto no-scrollbar">
        {children}
      </div>
    </div>
  );
}
