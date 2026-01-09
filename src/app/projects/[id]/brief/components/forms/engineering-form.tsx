"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EngineeringFormProps {
  projectId?: string;
  initialData?: any;
  onSave?: (data: any) => Promise<void>;
}

export function EngineeringForm({
  projectId,
  initialData,
  onSave,
}: EngineeringFormProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Инженерные системы</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Форма находится в разработке. Здесь будет информация о:
          </p>
          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
            <li>Системах отопления</li>
            <li>Теплых полах</li>
            <li>Системах кондиционирования</li>
            <li>Системах очистки воды</li>
            <li>Электрических системах</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
