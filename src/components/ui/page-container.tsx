const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="space-y-4 sm:space-y-8 container mx-auto //py-4">{children}</section>
  );
};

export default PageContainer;
