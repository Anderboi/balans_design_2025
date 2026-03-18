import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LinkIcon, MoreHorizontal, Share2 } from "lucide-react";
import Link from "next/link";

const ActionButtons = ({
  productUrl,
  size = "sm",
}: {
  productUrl?: string | null;
  size?: "sm" | "md";
}) => {
  const btnClass = cn(
    "rounded-full border-[#E5E5EA] text-[#86868B] hover:bg-[#F5F5F7]",
    size === "md" ? "size-12.5" : "size-8",
  );
  const iconClass = size === "md" ? "size-5" : "size-3.5";

  return (
    <div className="flex items-center justify-end gap-2 w-full">
      <Button
        size="icon"
        variant="ghost"
        className={btnClass}
      >
        <Share2 className={iconClass} />
      </Button>
      {productUrl && (
        <Link href={productUrl} target="_blank">
          <Button
            size="icon"
            variant="ghost"
            className={btnClass}
          >
            <LinkIcon className={iconClass} />
          </Button>
        </Link>
      )}
      <Button
        size="icon"
        variant="ghost"
        className={btnClass}
      >
        <MoreHorizontal className={iconClass} />
      </Button>
    </div>
  );
};

export default ActionButtons;
