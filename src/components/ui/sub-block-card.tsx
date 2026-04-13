import { cn } from '@/lib/utils';
import React from "react";

const SubBlockCard = ({
  children,
  title,
  className,
}: {
  children: React.ReactNode;
  title?: string;
  className?: string;
}) => {
  return (
    <article className={cn("bg-zinc-50 p-6 rounded-3xl border border-zinc-100/50 space-y-4", className)}>
      <h3
        className={`text-lg font-semibold text-zinc-900 flex items-center gap-2 ${
          !title && "hidden"
        }`}
      >
        {title}
      </h3>
      {children}
    </article>
  );
};

export default SubBlockCard;
