"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ApproveSwitchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  roomName: string;
  variantTitle: string;
}

export function ApproveSwitchDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  roomName,
  variantTitle,
}: ApproveSwitchDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-8 rounded-[32px]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-amber-500" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Смена утвержденного варианта
            </DialogTitle>
          </DialogHeader>

          <div className="text-gray-500 space-y-4 mb-8">
            <p>
              В помещении &quot;{roomName}&quot; уже есть утвержденный вариант.
            </p>
            <p>
              Вы собираетесь утвердить новый вариант &quot;{variantTitle}&quot;.
              Текущее утверждение будет снято.
            </p>
          </div>

          <DialogFooter className="w-full grid grid-cols-2 gap-3 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full py-6 border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button
              onClick={onConfirm}
              className="rounded-full py-6 bg-amber-600 hover:bg-amber-700 text-white font-medium"
              disabled={isLoading}
            >
              {isLoading ? "Обработка..." : "Продолжить"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
