"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddSpecMaterialDialog } from "./add-spec-material-dialog";
import { Contact, Company, SpecificationMaterial } from "@/types";
import { useRouter } from "next/navigation";

interface AddMaterialButtonProps {
  projectId: string;
  initialSuppliers: Contact[];
  initialSupplierCompanies: Company[];
  existingMaterials?: SpecificationMaterial[];
}

export function AddMaterialButton({
  projectId,
  initialSuppliers,
  initialSupplierCompanies,
  existingMaterials = [],
}: AddMaterialButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="rounded-full bg-[#1D1D1F] hover:bg-black text-white px-6 h-11 transition-all duration-300 shadow-sm flex items-center gap-2"
      >
        <Plus className="size-4" />
        Добавить материал
      </Button>

      <AddSpecMaterialDialog
        projectId={projectId}
        open={isOpen}
        onOpenChange={setIsOpen}
        onMaterialAdded={() => {
          router.refresh();
        }}
        initialSuppliers={initialSuppliers}
        initialSupplierCompanies={initialSupplierCompanies}
        existingMaterials={existingMaterials}
      />
    </>
  );
}
