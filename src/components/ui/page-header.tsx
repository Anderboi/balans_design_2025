import { cn } from "@/lib/utils";

const PageHeader = ({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) => {
  return (
    <div className={cn(className)}>
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-1">{description}</p>
    </div>
  );
};

export default PageHeader;
