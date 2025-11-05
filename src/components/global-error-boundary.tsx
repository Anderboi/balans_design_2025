'use client';

import React from 'react';
import ErrorFallback from '@/components/ui/error-fallback';

interface GlobalErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface GlobalErrorBoundaryProps {
  children: React.ReactNode;
}

class GlobalErrorBoundary extends React.Component<GlobalErrorBoundaryProps, GlobalErrorBoundaryState> {
  constructor(props: GlobalErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): GlobalErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Global error caught:', error, errorInfo);
    
    // Log error to an error reporting service
    if (typeof window !== 'undefined') {
      // In a real app, you might send this to a service like Sentry
      console.error('Global error reported:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
          <ErrorFallback
            error={this.state.error}
            resetError={this.resetError}
            title="Ошибка приложения"
            message="К сожалению, в приложении произошла критическая ошибка. Не волнуйтесь, ваша работа в безопасности."
            showHomeLink={false}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default GlobalErrorBoundary;