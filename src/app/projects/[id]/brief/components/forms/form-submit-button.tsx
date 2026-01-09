import { Button } from '@/components/ui/button';

const FormSubmitButton = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <div className="w-full flex justify-end border-t pt-4">
      <Button type="submit" size={"lg"} disabled={isLoading}>
        {isLoading ? "Сохранение..." : "Сохранить раздел"}
      </Button>
    </div>
  );
}

export default FormSubmitButton