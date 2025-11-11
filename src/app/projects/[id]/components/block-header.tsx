import { Button } from "@/components/ui/button";
import Link from "next/link";

const BlockHeader = ({ title, href }: { title: string; href: string }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Button asChild>
        <Link href={href}>Добавить помещение</Link>
      </Button>
    </div>
  );
};

export default BlockHeader;
