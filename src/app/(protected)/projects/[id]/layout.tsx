import PageContainer from "@/components/ui/page-container";
import React from "react";

// export const revalidate = 0; // Отключаем кэширование для этой страницы

const ProjectLayout = async ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  
  return (
    <PageContainer>
      {children}
      {modal}
    </PageContainer>
  );
};

export default ProjectLayout;
