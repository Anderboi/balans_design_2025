import { cn } from "@/lib/utils";

interface LandingBlockHeaderProps {
  title: string;
  children: React.ReactNode;
  background?: "white" | "dark";
}

const LandingBlockHeader = ({
  title,
  children,
  background,
}: LandingBlockHeaderProps) => {
  return (
    <>
      <p
        className={
          "text-center text-[10px] font-semibold tracking-[0.2em] uppercase text-[#71717a] mb-3 reveal"
        }
      >
        {title}
      </p>
      <p
        className={cn(
          "text-center font-display font-semibold tracking-tight text-[56px]/16 sm:text-[72px]/20 text-[#0a0a0a] mb-14 reveal",
          {
            "text-[#fafafa]": background === "dark",
          },
        )}
      >
        {children}
      </p>
    </>
  );
};

export default LandingBlockHeader;
