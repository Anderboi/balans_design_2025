"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projectsService } from "@/lib/services/projects";
import { contactsService } from "@/lib/services/contacts";
import { Project, ProjectStage, Contact, ContactType } from "@/types";

export default function NewProjectPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    area: "",
    client_id: "",
    stage: ProjectStage.PREPROJECT,
    residents: "",
    demolition_info: "",
    construction_info: "",
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientData = await contactsService.getContactsByType(
          ContactType.CLIENT
        );
        // Фильтруем менеджеров из списка клиентов
        const filteredClients = clientData.filter(
          (client) => client.position?.toLowerCase() !== "менеджер"
        );
        setClients(filteredClients);
      } catch (error) {
        console.error("Ошибка при загрузке клиентов:", error);
      }
    };

    fetchClients();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Преобразуем площадь в число
      const areaValue = parseFloat(formData.area);
      // Prepare project data, excluding client_id if it's empty
      const projectData: Omit<
        Project,
        "id" | "created_at" | "updated_at" | "contacts" | "rooms"
      > = {
        ...formData,
        area: !isNaN(areaValue) && areaValue ? areaValue : 0, // Default to 0 if invalid or empty
        client_id:
          formData.client_id === "none" || formData.client_id === ""
            ? null
            : formData.client_id,
      };

      console.log(projectData);

      await projectsService.createProject(projectData);
      window.location.href = "/projects";
    } catch (error) {
      console.error("Ошибка при создании проекта:", error);
      alert("Произошла ошибка при создании проекта");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Новый проект</h1>

      <Card>
        <CardHeader>
          <CardTitle>Информация о проекте</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название проекта</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Адрес</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Площадь (м²)</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Стадия проекта</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => handleSelectChange("stage", value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={ProjectStage.PREPROJECT}
                      placeholder="Выберите стадию"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProjectStage.PREPROJECT}>
                      Предпроектная
                    </SelectItem>
                    <SelectItem value={ProjectStage.CONCEPT}>
                      Концепция
                    </SelectItem>
                    <SelectItem value={ProjectStage.WORKING}>
                      Рабочая
                    </SelectItem>
                    <SelectItem value={ProjectStage.SUPERVISION}>
                      Авторский контроль
                    </SelectItem>
                    <SelectItem value={ProjectStage.COMPLETION}>
                      Комплектация
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Клиент</Label>
              <div className="flex items-center space-x-2">
                <Select
                  value={formData.client_id}
                  onValueChange={(value) => {
                    if (value === "new") {
                      // TODO: open modal or redirect to create client
                      alert("Создание нового клиента пока не реализовано");
                    } else {
                      handleSelectChange("client_id", value);
                    }
                  }}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Выберите клиента или создайте нового" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-</SelectItem>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="new">+ Добавить клиента</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="residents">Информация о проживающих</Label>
              <Textarea
                id="residents"
                name="residents"
                value={formData.residents}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Создать проект"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
