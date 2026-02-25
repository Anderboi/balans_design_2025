const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="space-y-8 container mx-auto py-4 //md:py-6">{children}</section>
  );
};

export default PageContainer;
