import React from "react";
import { cn } from "@/lib/utils";

const MainBlockCard = ({
  isLocked = false,
  children,
  className,
}: {
  isLocked?: boolean;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "rounded-3xl transition-all duration-300  ",
        isLocked
          ? "opacity-60"
          : "shadow-sm bg-background border border-gray-100",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MainBlockCard;
