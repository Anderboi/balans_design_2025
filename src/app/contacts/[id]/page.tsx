'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { companiesService } from '@/lib/services/companies';
import { contactsService } from '@/lib/services/contacts';
import { Company, Contact } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building, Phone, Mail, Globe, ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import AddContactDialog from '../components/add-contact-dialog';
import { ContactsDataTable } from '@/components/contacts-data-table';

export default function CompanyDetailsPage() {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isAddContactDialogOpen, setIsAddContactDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyData = async () => {
      setIsLoading(true);
      try {
        if (typeof id === 'string') {
          const companyData = await companiesService.getCompanyById(id);
          if (companyData) {
            setCompany(companyData);
            const contactsData = await contactsService.getContactsByCompany(id);
            setContacts(contactsData);
          }
        }
      } catch (error) {
        console.error('Ошибка при получении данных компании:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanyData();
  }, [id]);

  const handleAddContact = async (newContact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (company) {
        const contactWithCompany = {
          ...newContact,
          company_id: company.id
        };
        const createdContact = await contactsService.createContact(contactWithCompany);
        setContacts(prevContacts => [...prevContacts, createdContact]);
        setIsAddContactDialogOpen(false);
      }
    } catch (error) {
      console.error('Ошибка при создании контакта:', error);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return <div className="container mx-auto py-6">Загрузка...</div>;
  }

  if (!company) {
    return (
      <div className="container mx-auto py-6">
        <p>Компания не найдена</p>
        <Link href="/contacts">
          <Button className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Вернуться к списку компаний
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/contacts">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Назад к списку
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{company.name}</CardTitle>
                  <p className="text-muted-foreground">{company.type}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {company.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {company.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{company.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <a
                    href={`mailto:${company.email}`}
                    className="text-primary hover:underline"
                  >
                    {company.email}
                  </a>
                </div>
                {company.address && (
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span>{company.address}</span>
                  </div>
                )}
                {company.tags && company.tags.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Теги:</p>
                    <div className="flex flex-wrap gap-2">
                      {company.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {company.notes && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Примечания:</p>
                    <p className="text-sm">{company.notes}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <>
            <div className="flex flex-row items-center justify-between">
              <CardTitle>Контакты компании</CardTitle>
            </div>
            <>
              {contacts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  У этой компании пока нет контактов
                </p>
              ) : (
                <ContactsDataTable data={contacts} />
              )}
            </>
            <Button onClick={() => setIsAddContactDialogOpen(true)} size="sm" variant={'outline'} className='w-full mt-4'>
              <Plus className="mr-2 h-4 w-4" />
              Добавить новый
            </Button>
          </>
        </div>
      </div>

      <AddContactDialog
        open={isAddContactDialogOpen}
        onOpenChange={setIsAddContactDialogOpen}
        onSubmit={handleAddContact}
        companyId={company.id}
      />
    </div>
  );
}