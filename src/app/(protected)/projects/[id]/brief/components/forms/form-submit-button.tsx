import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface FormSubmitButtonProps {
  isLoading: boolean;
  onActionSelect?: (action: "save" | "complete") => void;
  isCompleted?: boolean;
}

const FormSubmitButton = ({
  isLoading,
  onActionSelect,
  isCompleted,
}: FormSubmitButtonProps) => {
  return (
    <div className="w-full flex justify-end gap-3 border-t pt-2 sm:pt-4">
      {onActionSelect ? (
        <>
          <Button
            type="submit"
            variant="outline"
            size={"lg"}
            disabled={isLoading}
            onClick={() => onActionSelect("save")}
            className="border-gray-200"
          >
            {isLoading ? "Сохранение..." : "Сохранить"}
          </Button>

          <Button
            type="submit"
            size={"lg"}
            disabled={isLoading}
            onClick={() => onActionSelect("complete")}
            className="gap-2"
          >
            {isLoading ? (
              "Сохранение..."
            ) : (
              <>
                <Check className="w-4 h-4" />
                Завершить раздел
              </>
            )}
          </Button>
        </>
      ) : (
        <Button type="submit" size={"lg"} disabled={isLoading}>
          {isLoading ? "Сохранение..." : "Сохранить раздел"}
        </Button>
      )}
    </div>
  );
};

export default FormSubmitButton;
