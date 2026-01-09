import React from "react";

const SubBlockCard = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  return (
    <article className="bg-zinc-50/50 p-6 rounded-3xl border border-zinc-100/50 space-y-6">
      <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
        {title}
      </h3>
      {children}
    </article>
  );
};

export default SubBlockCard;
