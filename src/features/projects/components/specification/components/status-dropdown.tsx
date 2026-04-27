"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { MaterialStatus, MATERIAL_STATUS_LABELS } from "@/types";

// Constants — Apple HIG system colors
export const STATUS_OPTIONS = [
  { label: MATERIAL_STATUS_LABELS[MaterialStatus.NOT_SELECTED], value: MaterialStatus.NOT_SELECTED, color: "#8E8E93" },
  { label: MATERIAL_STATUS_LABELS[MaterialStatus.SELECTED], value: MaterialStatus.SELECTED, color: "#AF52DE" },
  { label: MATERIAL_STATUS_LABELS[MaterialStatus.REJECTED], value: MaterialStatus.REJECTED, color: "#FF3B30" },
  { label: MATERIAL_STATUS_LABELS[MaterialStatus.APPROVED], value: MaterialStatus.APPROVED, color: "#FF9F0A" },
  { label: MATERIAL_STATUS_LABELS[MaterialStatus.ORDERED], value: MaterialStatus.ORDERED, color: "#007AFF" },
  { label: MATERIAL_STATUS_LABELS[MaterialStatus.PAID], value: MaterialStatus.PAID, color: "#5856D6" },
  { label: MATERIAL_STATUS_LABELS[MaterialStatus.DELIVERED], value: MaterialStatus.DELIVERED, color: "#34C759" },
] as const;

const StatusDropdown = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) => {
  const current =
    STATUS_OPTIONS.find((s) => s.value === value) ?? STATUS_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-[#F2F2F7] hover:bg-[#F5F5F7] px-4 py-0 h-8 flex items-center gap-2"
        >
          <span
            className="size-1.5 rounded-full shrink-0"
            style={{ backgroundColor: current.color }}
          />
          <span className="text-[12px] font-medium text-[#1D1D1F]">
            {current.label}
          </span>
          <ChevronDown className="size-3 text-[#86868B]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl border-[#F2F2F7]">
        {STATUS_OPTIONS.map((status) => (
          <DropdownMenuItem
            key={status.value}
            className="flex items-center gap-2 py-2.5 px-3 rounded-xl cursor-pointer"
            onClick={() => onChange(status.value)}
          >
            <span
              className="size-1.5 rounded-full shrink-0"
              style={{ backgroundColor: status.color }}
            />
            <span className="text-sm">{status.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
