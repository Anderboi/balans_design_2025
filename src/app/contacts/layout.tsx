import PageErrorBoundary from "@/components/page-error-boundary";
import PageContainer from "@/components/ui/page-container";
import React from "react";

const ContactsLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <PageErrorBoundary pageName="Страница контактов">
      <PageContainer>{children}</PageContainer>
    </PageErrorBoundary>
  );
};

export default ContactsLayout;
