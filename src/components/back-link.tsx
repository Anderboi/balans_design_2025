import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const BackLink = ({ href, className }: { href: string, className?: string }) => {
  return (
    <Link
      href={href}
      className={`inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors ${className}`}
    >
      <ChevronLeft className="size-4 mr-1" />
      Назад
    </Link>
  );
};

export default BackLink;
