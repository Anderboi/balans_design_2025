import { Control } from "react-hook-form";
import { ChevronDownIcon, Plus } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Contact } from "@/types";
import { AddMaterialFormValues } from "@/lib/schemas/materials";

interface SupplierSectionProps {
  control: Control<AddMaterialFormValues>;
  filteredSuppliers: Contact[];
  supplierCompaniesMap: Record<string, string>;
  supplierQuery: string;
  setSupplierQuery: (query: string) => void;
  setIsAddSupplierOpen: (open: boolean) => void;
}

export function SupplierSection({
  control,
  filteredSuppliers,
  supplierCompaniesMap,
  supplierQuery,
  setSupplierQuery,
  setIsAddSupplierOpen,
}: SupplierSectionProps) {
  return (
    <FormField
      control={control}
      name="supplier"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Поставщик</FormLabel>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className="w-full justify-between font-normal"
                >
                  <span>{field.value || "Выберите поставщика"}</span>
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[300px]">
              <div className="p-2">
                <Input
                  placeholder="Поиск или создание..."
                  value={supplierQuery}
                  onChange={(e) => setSupplierQuery(e.target.value)}
                />
              </div>
              {filteredSuppliers.map((s) => {
                const companyName = s.company_id
                  ? supplierCompaniesMap[s.company_id]
                  : undefined;
                const displayName = companyName
                  ? `${s.name} — ${companyName}`
                  : s.name;
                return (
                  <DropdownMenuItem
                    key={s.id}
                    onSelect={() => field.onChange(displayName)}
                  >
                    {displayName}
                  </DropdownMenuItem>
                );
              })}
              {filteredSuppliers.length === 0 && supplierQuery && (
                <DropdownMenuItem onSelect={() => setIsAddSupplierOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Добавить &quot;{supplierQuery}&quot;
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
