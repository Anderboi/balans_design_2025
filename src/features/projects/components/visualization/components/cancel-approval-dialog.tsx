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

interface CancelApprovalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isCanceling: boolean;
  roomName: string;
}

export function CancelApprovalDialog({
  open,
  onOpenChange,
  onConfirm,
  isCanceling,
  roomName,
}: CancelApprovalDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-8 rounded-[32px]">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Отмена согласования
            </DialogTitle>
          </DialogHeader>

          <div className="text-gray-500 space-y-4 mb-8">
            <p>
              Вы собираетесь отменить утвержденную визуализацию для помещения
              &quot;{roomName}&quot;.
            </p>
            <p className="text-sm">
              <span className="font-bold text-gray-700">Внимание:</span> Это
              действие вернет элемент в статус &quot;На согласовании&quot;.
            </p>
          </div>

          <DialogFooter className="w-full grid grid-cols-2 gap-3 sm:space-x-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-full py-6 border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
              disabled={isCanceling}
            >
              Вернуться
            </Button>
            <Button
              onClick={onConfirm}
              className="rounded-full py-6 bg-red-600 hover:bg-red-700 text-white font-medium"
              disabled={isCanceling}
            >
              {isCanceling ? "Отмена..." : "Подтвердить отмену"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
