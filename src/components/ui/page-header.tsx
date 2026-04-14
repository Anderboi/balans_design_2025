import { cn } from "@/lib/utils";

const PageHeader = ({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn(className, 'flex items-center justify-between gap-4')}>
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <p className="text-muted-foreground text-sm sm:text-base mt-1">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default PageHeader;
