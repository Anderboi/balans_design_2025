import PageContainer from "@/components/ui/page-container";
import React from "react";

// export const revalidate = 0; // Отключаем кэширование для этой страницы

const ProjectLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PageContainer>
      {children}
    </PageContainer>
  );
};

export default ProjectLayout;
