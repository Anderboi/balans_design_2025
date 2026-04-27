import { useState, useMemo } from "react";
import { UseFormSetValue } from "react-hook-form";
import { Contact, ContactType, Company } from "@/types";
import { contactsService } from "@/lib/services/contacts";

interface UseSupplierSelectionProps {
  initialSuppliers: Contact[];
  initialSupplierCompanies: Company[];
  setValue: UseFormSetValue<any>;
}

export function useSupplierSelection({
  initialSuppliers,
  initialSupplierCompanies,
  setValue,
}: UseSupplierSelectionProps) {
  const [suppliers, setSuppliers] = useState<Contact[]>(initialSuppliers);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [supplierQuery, setSupplierQuery] = useState("");

  const supplierCompaniesMap = useMemo(() => {
    const map: Record<string, string> = {};
    initialSupplierCompanies.forEach((c) => {
      if (c && c.id) map[c.id] = c.name;
    });
    return map;
  }, [initialSupplierCompanies]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const companyName = s.company_id
        ? supplierCompaniesMap[s.company_id] || ""
        : "";
      const hay = `${s.name} ${companyName}`.toLowerCase();
      return hay.includes(supplierQuery.toLowerCase());
    });
  }, [suppliers, supplierQuery, supplierCompaniesMap]);

  const handleCreateSupplier = async (
    contact: Omit<Contact, "id" | "created_at" | "updated_at">
  ) => {
    try {
      const created = await contactsService.createContact({
        ...contact,
        type: ContactType.SUPPLIER,
      });
      setSuppliers((prev) => [created, ...prev]);
      setValue("supplier", created.name);
      setIsAddSupplierOpen(false);
    } catch (error) {
      console.error("Ошибка при создании поставщика:", error);
    }
  };

  return {
    suppliers,
    supplierQuery,
    setSupplierQuery,
    isAddSupplierOpen,
    setIsAddSupplierOpen,
    supplierCompaniesMap,
    filteredSuppliers,
    handleCreateSupplier,
  };
}
