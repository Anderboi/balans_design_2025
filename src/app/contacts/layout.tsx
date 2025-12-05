import PageErrorBoundary from "@/components/page-error-boundary";
import React from "react";

const ContactsLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <PageErrorBoundary pageName="Страница контактов">
      {children}
    </PageErrorBoundary>
  );
};

export default ContactsLayout;
