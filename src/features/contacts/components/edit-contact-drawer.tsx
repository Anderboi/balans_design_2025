"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField } from "@/components/ui/form";
import {
  EditContactSchema,
  EditContactFormValues,
} from "@/lib/schemas/contacts";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormRow } from "@/components/ui/form-row";
import SubBlockCard from "@/components/ui/sub-block-card";
import { contactsService } from "@/lib/services/contacts";
import { projectsService } from "@/lib/services/projects";
import { Contact, Project } from "@/types";
import { updateContact } from "../actions";

interface EditContactDrawerProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactUpdated: () => void;
}

export function EditContactDrawer({
  contact,
  open,
  onOpenChange,
  onContactUpdated,
}: EditContactDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const form = useForm<EditContactFormValues>({
    resolver: zodResolver(EditContactSchema) as Resolver<EditContactFormValues>,
    values: {
      name: contact?.name || "",
      type: contact?.type || (undefined as any),
      position: contact?.position || "",
      phone: contact?.phone || "",
      email: contact?.email || "",
      address: contact?.address || "",
      notes: contact?.notes || "",
      company_id: contact?.company_id || null,
    },
  });

  const {
    formState: { isDirty },
    control,
    reset,
  } = form;

  useEffect(() => {
    if (contact && open) {
      const fetchProjects = async () => {
        try {
          const projectData = await projectsService.getProjectsByClientId(
            contact.id,
          );
          setProjects(projectData);
        } catch (error) {
          console.error("Ошибка при загрузке проектов:", error);
        }
      };

      fetchProjects();
    }
  }, [contact, open]);

  const onSubmit = async (values: EditContactFormValues) => {
    if (!contact) return;

    try {
      setIsLoading(true);
      const result = await updateContact(contact.id, values);
      if (result.success) {
        onContactUpdated();
        onOpenChange(false);
      } else {
        console.error("Ошибка при обновлении контакта:", result.error);
      }
    } catch (error) {
      console.error("Ошибка при обновлении контакта:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChangeWrapper = (newOpen: boolean) => {
    if (!newOpen) {
      if (isDirty) {
        setShowExitConfirmation(true);
        return;
      }
    }
    onOpenChange(newOpen);
  };

  const confirmClose = () => {
    setShowExitConfirmation(false);
    reset();
    onOpenChange(false);
  };

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={handleOpenChangeWrapper}
        direction="bottom"
      >
        <DrawerContent className="//max-h-[95vh] sm:min-w-[640px]">
          <DrawerHeader>
            <DrawerTitle>Редактировать контакт</DrawerTitle>
            <DrawerDescription>
              Внесите изменения в информацию о контакте
            </DrawerDescription>
          </DrawerHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col h-full overflow-hidden"
            >
              <ScrollArea className="flex-1 px-4 overflow-auto">
                <div className="space-y-8 pb-6">
                  <SubBlockCard title="Основная информация">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={control}
                        name="name"
                        render={({ field }) => (
                          <FormRow label="Имя" htmlFor="edit-name" required>
                            <FormControl>
                              <Input
                                id="edit-name"
                                placeholder="Имя контакта"
                                {...field}
                              />
                            </FormControl>
                          </FormRow>
                        )}
                      />

                      <FormField
                        control={control}
                        name="position"
                        render={({ field }) => (
                          <FormRow label="Должность" htmlFor="edit-position">
                            <FormControl>
                              <Input
                                id="edit-position"
                                placeholder="Должность"
                                {...field}
                              />
                            </FormControl>
                          </FormRow>
                        )}
                      />

                      <FormField
                        control={control}
                        name="email"
                        render={({ field }) => (
                          <FormRow label="Email" htmlFor="edit-email">
                            <FormControl>
                              <Input
                                id="edit-email"
                                type="email"
                                placeholder="Email"
                                {...field}
                              />
                            </FormControl>
                          </FormRow>
                        )}
                      />

                      <FormField
                        control={control}
                        name="phone"
                        render={({ field }) => (
                          <FormRow label="Телефон" htmlFor="edit-phone">
                            <FormControl>
                              <Input
                                id="edit-phone"
                                placeholder="Телефон"
                                {...field}
                              />
                            </FormControl>
                          </FormRow>
                        )}
                      />
                    </div>
                  </SubBlockCard>

                  <SubBlockCard title="Адрес и заметки">
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={control}
                        name="address"
                        render={({ field }) => (
                          <FormRow label="Адрес" htmlFor="edit-address">
                            <FormControl>
                              <Input
                                id="edit-address"
                                placeholder="Адрес"
                                {...field}
                              />
                            </FormControl>
                          </FormRow>
                        )}
                      />

                      <FormField
                        control={control}
                        name="notes"
                        render={({ field }) => (
                          <FormRow label="Заметки" htmlFor="edit-notes">
                            <FormControl>
                              <Input
                                id="edit-notes"
                                placeholder="Заметки"
                                {...field}
                              />
                            </FormControl>
                          </FormRow>
                        )}
                      />
                    </div>
                  </SubBlockCard>

                  <SubBlockCard title="Проекты">
                    <div className="space-y-2">
                      {projects.length > 0 ? (
                        projects.map((project) => (
                          <Link
                            key={project.id}
                            href={`/projects/${project.id}`}
                          >
                            <div className="block p-4 bg-white rounded-2xl border border-zinc-100/50 hover:bg-zinc-50 transition-colors">
                              <span className="font-medium text-zinc-900">
                                {project.name}
                              </span>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-sm text-zinc-500 py-4 text-center bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                          Нет закрепленных проектов.
                        </p>
                      )}
                    </div>
                  </SubBlockCard>
                </div>
              </ScrollArea>

              <DrawerFooter>
                <div className="flex flex-col-reverse sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="lg"
                    onClick={() => handleOpenChangeWrapper(false)}
                    className="sm:flex-1"
                  >
                    Отмена
                  </Button>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isLoading}
                    className="sm:flex-1 rounded-full"
                  >
                    {isLoading ? "Сохранение..." : "Сохранить изменения"}
                  </Button>
                </div>
              </DrawerFooter>
            </form>
          </Form>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить редактирование?</AlertDialogTitle>
            <AlertDialogDescription>
              У вас есть несохраненные изменения. Все внесенные изменения будут
              потеряны.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-base border-none shadow-none h-12">
              Продолжить редактирование
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClose}
              className="bg-destructive text-white text-base h-12 rounded-full hover:bg-destructive/90"
            >
              Да, отменить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
