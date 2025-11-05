'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const TestErrorComponent = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error('This is a test error to demonstrate error boundary functionality');
  }

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-medium mb-2">Тестирование Error Boundary</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Нажмите кнопку ниже, чтобы искусственно вызвать ошибку и проверить работу Error Boundary
      </p>
      <Button 
        onClick={() => setShouldError(true)}
        variant="destructive"
      >
        Вызвать ошибку
      </Button>
    </div>
  );
};

export default TestErrorComponent;