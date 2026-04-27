"use client";

import { useState, useTransition } from "react";
import { Contact, ContactType } from "@/types";
import { createContact } from "@/features/contacts/actions";
import { updateProjectAction } from "@/lib/actions/projects";
import AddContactDialog from "@/features/contacts/components/add-contact-dialog";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

interface ProjectClientSelectorProps {
  projectId: string;
  clientName?: string | null;
}

export function ProjectClientSelector({
  projectId,
  clientName,
}: ProjectClientSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleAddClient = async (
    contactData: Omit<Contact, "id" | "created_at" | "updated_at">,
  ) => {
    startTransition(async () => {
      try {
        // 1. Create the contact
        const contactRes = await createContact({
          ...contactData,
          type: ContactType.CLIENT,
        });

        if (!contactRes.success || !contactRes.data) {
          toast.error(contactRes.error || "Не удалось создать контакт");
          return;
        }

        // 2. Link contact to project
        const projectRes = await updateProjectAction(projectId, {
          client_id: contactRes.data.id,
        });

        if (!projectRes.success) {
          toast.error("Контакт создан, но не удалось привязать его к проекту");
          return;
        }

        toast.success("Клиент успешно добавлен и привязан к проекту");
        setIsOpen(false);
      } catch (error) {
        console.error("Error adding client to project:", error);
        toast.error("Произошла ошибка при добавлении клиента");
      }
    });
  };

  if (clientName) {
    return <span className="text-zinc-700 font-medium">{clientName}</span>;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className="text-zinc-400 hover:text-zinc-800 transition-colors underline decoration-dashed underline-offset-4 inline-flex items-center gap-1.5 disabled:opacity-50"
      >
        <UserPlus className="size-3.5" />
        Добавить клиента
      </button>

      <AddContactDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSubmit={handleAddClient}
        defaultType={ContactType.CLIENT}
      />
    </>
  );
}
