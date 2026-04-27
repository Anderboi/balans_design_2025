import { Button } from "@/components/ui/button";
import Link from "next/link";

const BlockHeader = ({
  title,
  buttontext,
  href,
  onClick,
}: {
  title: string;
  buttontext: string;
  href?: string;
  onClick?: () => void;
}) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl md:text-5xl text-zinc-900 tracking-tight">{title}</h1>
      {onClick ? (
        <Button onClick={onClick}>{buttontext}</Button>
      ) : (
        <Button asChild>
          <Link href={href!}>{buttontext}</Link>
        </Button>
      )}
    </div>
  );
};

export default BlockHeader;
