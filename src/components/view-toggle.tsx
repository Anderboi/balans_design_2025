import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutGrid, List } from "lucide-react";

const ViewToggle = ({
  viewMode,
  onViewModeChange,
}: {
  viewMode: "grid" | "list";
  onViewModeChange: (m: "grid" | "list") => void;
}) => {
  return (
    <article>
      <div className="hidden sm:flex items-center gap-1 bg-zinc-100 p-1 rounded-lg ">
        <Button
          variant={viewMode === "grid" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("grid")}
          className={cn(
            viewMode === "grid" && "bg-background ",
            "cursor-pointer hover:bg-zinc-50 hover:text-zinc-800 text-zinc-600",
          )}
        >
          <LayoutGrid className="size-4" />
        </Button>
        <Button
          variant={viewMode === "list" ? "default" : "ghost"}
          size="icon"
          onClick={() => onViewModeChange("list")}
          className={cn(
            viewMode === "list" && "bg-background",
            "cursor-pointer hover:bg-zinc-50 hover:text-zinc-800 text-zinc-600",
          )}
        >
          <List className="size-4" />
        </Button>
      </div>
      <div className="sm:hidden">
        {viewMode === "list" ? (
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              viewMode === "list" && "bg-background ",
              "cursor-pointer hover:bg-zinc-50 hover:text-zinc-800 text-zinc-600",
            )}
          >
            <LayoutGrid className="size-4" />
          </Button>
        ) : (
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => onViewModeChange("list")}
            className={cn(
              viewMode === "grid" && "bg-background",
              "cursor-pointer hover:bg-zinc-50 hover:text-zinc-800 text-zinc-600",
            )}
          >
            <List className="size-4" />
          </Button>
        )}
      </div>
    </article>
  );
};

export default ViewToggle;
