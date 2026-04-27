import MainBlockCard from '@/components/ui/main-block-card'

const BriefBlockWraper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="sm:mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <MainBlockCard className="p-2 md:p-12">{children}</MainBlockCard>
    </div>
  );
};

export default BriefBlockWraper