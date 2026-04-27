import Image from "next/image";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

const Thumbnail = ({
  url,
  name,
  className,
}: {
  url?: string | null;
  name: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative border border-[#F2F2F7] size-24 shrink-0 overflow-hidden rounded-2xl bg-[#F5F5F7]",
        className,
      )}
    >
      {url ? (
        <Image src={url} alt={name} fill className="object-cover" />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Package className="size-8 text-[#D1D1D6]" />
        </div>
      )}
    </div>
  );
};

export default Thumbnail;
