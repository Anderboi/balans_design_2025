'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { contactsService } from '@/lib/services/contacts';
import { projectsService } from '@/lib/services/projects';
import { Contact, Project } from '@/types';

interface EditContactDrawerProps {
  contact: Contact | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactUpdated: () => void;
}

export function EditContactDrawer({ contact, open, onOpenChange, onContactUpdated }: EditContactDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState<Partial<Contact>>({});
  const [initialData, setInitialData] = useState<Partial<Contact>>({});
  const [isDirty, setIsDirty] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertAction, setAlertAction] = useState<'save' | 'cancel' | null>(null);

  useEffect(() => {
    if (contact) {
      const initial = {
        name: contact.name || '',
        position: contact.position || '',
        email: contact.email || '',
        phone: contact.phone || '',
      };
      setFormData(initial);
      setInitialData(initial);
      setIsDirty(false);

      const fetchProjects = async () => {
        try {
          const projectData = await projectsService.getProjectsByClientId(contact.id);
          setProjects(projectData);
        } catch (error) {
          console.error('Ошибка при загрузке проектов:', error);
        }
      };

      fetchProjects();
    }
  }, [contact]);

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== JSON.stringify(initialData));
  }, [formData, initialData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setAlertAction('save');
    setIsAlertOpen(true);
  };

  const handleCancel = () => {
    if (isDirty) {
      setAlertAction('cancel');
      setIsAlertOpen(true);
    } else {
      onOpenChange(false);
    }
  };

  const confirmAlert = () => {
    if (alertAction === 'save') {
      handleSubmit();
    } else if (alertAction === 'cancel') {
      onOpenChange(false);
    }
    setIsAlertOpen(false);
    setAlertAction(null);
  };

  const cancelAlert = () => {
    setIsAlertOpen(false);
    setAlertAction(null);
  };

  const handleSubmit = async () => {
    if (!contact) return;

    try {
      setIsLoading(true);
      await contactsService.updateContact(contact.id, formData);
      onContactUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Ошибка при обновлении контакта:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} direction='right'>
        <DrawerContent className="//max-h-[95vh] rounded-l-2xl p-2">
          <DrawerHeader>
            <DrawerTitle>Редактировать контакт</DrawerTitle>
            <DrawerDescription>
              Внесите изменения в информацию о контакте
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="flex-1 px-4">
            <form className="space-y-6 pb-6">
              <div className="grid grid-cols-1 //md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Имя *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Имя контакта"
                    required
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="edit-position">Должность</Label>
                  <Input
                    id="edit-position"
                    value={formData.position || ''}
                    onChange={(e) => handleInputChange('position', e.target.value)}
                    placeholder="Должность"
                  />
                </div> */}
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Телефон</Label>
                  <Input
                    id="edit-phone"
                    value={formData.phone || ''}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Телефон"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium">Проекты</h3>
                <div className="mt-4 space-y-2">
                  {projects.length > 0 ? (
                    projects.map(project => (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <span className="block p-2 border rounded-md hover:bg-gray-100">
                          {project.name}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Нет закрепленных проектов.</p>
                  )}
                </div>
              </div>
            </form>
          </ScrollArea>

          <DrawerFooter>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertAction === 'save' ? 'Подтвердите сохранение' : 'Вы уверены?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertAction === 'save' 
                ? 'Вы уверены, что хотите сохранить изменения?' 
                : 'У вас есть несохраненные изменения. Вы уверены, что хотите выйти без сохранения?'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelAlert}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAlert}>Подтвердить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
