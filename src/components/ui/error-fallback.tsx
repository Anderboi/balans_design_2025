import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
 title?: string;
  message?: string;
  showHomeLink?: boolean;
  showReloadButton?: boolean;
  showResetButton?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Произошла ошибка',
  message = 'К сожалению, произошла ошибка в работе приложения.',
  showHomeLink = true,
  showReloadButton = true,
  showResetButton = true,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-3">
            <AlertCircle className="text-destructive" size={24} />
          </div>
          <CardTitle className="text-destructive">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">{message}</p>
          
          {error?.message && (
            <details className="mb-4">
              <summary className="text-sm text-muted-foreground cursor-pointer mb-2 text-left">
                Подробности ошибки
              </summary>
              <pre className="text-xs bg-muted p-3 rounded text-left overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            {showResetButton && resetError && (
              <Button onClick={resetError} variant="default" className="flex items-center gap-2">
                <RotateCcw size={16} />
                Попробовать снова
              </Button>
            )}
            
            {showReloadButton && (
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <RotateCcw size={16} />
                Перезагрузить
              </Button>
            )}
            
            {showHomeLink && (
              <Button asChild variant="secondary" className="flex items-center gap-2">
                <Link href="/">
                  <Home size={16} />
                  На главную
                </Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorFallback;