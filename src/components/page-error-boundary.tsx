'use client';

import React from 'react';
import ErrorBoundary from './error-boundary';
import ErrorFallback from '@/components/ui/error-fallback';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
 pageName?: string;
}

const PageErrorBoundary: React.FC<PageErrorBoundaryProps> = ({
  children,
  pageName = 'странице'
}) => {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorFallback
          error={error}
          resetError={resetError}
          title={`Ошибка на ${pageName}`}
          message="Произошла ошибка при загрузке содержимого. Это может быть временной проблемой."
          showHomeLink={true}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;