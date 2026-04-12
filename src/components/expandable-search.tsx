"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface ExpandableSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ExpandableSearch({
  searchQuery,
  onSearchChange,
}: ExpandableSearchProps) {
  const [expanded, setExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  // On desktop always show full input
  return (
    <>
      {/* Mobile: icon → expand */}
      <div className="flex sm:hidden items-center">
        {expanded ? (
          <div className="flex items-center gap-2 bg-zinc-100 rounded-xl px-3 py-2 w-48 transition-all">
            <Search className="size-4 text-zinc-400 shrink-0" />
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-zinc-400"
            />
            <button
              onClick={() => {
                onSearchChange("");
                setExpanded(false);
              }}
              className="text-zinc-400 hover:text-zinc-600"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setExpanded(true)}
            className="size-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 text-zinc-500 transition-colors"
          >
            <Search className="size-4" />
          </button>
        )}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden sm:flex items-center gap-2 bg-zinc-100 rounded-xl px-3 py-2 min-w-48 xl:min-w-64">
        <Search className="size-4 text-zinc-400 shrink-0" />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Поиск материала..."
          className="bg-transparent text-sm outline-none w-full placeholder:text-zinc-400"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="text-zinc-400 hover:text-zinc-600"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </>
  );
}
