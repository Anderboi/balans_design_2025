"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projectsService } from "@/lib/services/projects";
import { ProjectStage } from "@/types";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    area: "",
    stage: ProjectStage.PREPROJECT,
    residents: "",
    demolition_info: "",
    construction_info: ""
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await projectsService.getProjectById(id);
        if (project) {
          setFormData({
            name: project.name || "",
            address: project.address || "",
            area: project.area ? String(project.area) : "",
            stage: project.stage || ProjectStage.PREPROJECT,
            residents: project.residents || "",
            demolition_info: project.demolition_info || "",
            construction_info: project.construction_info || ""
          });
        }
      } catch (error) {
        console.error("Ошибка при загрузке проекта:", error);
        alert("Не удалось загрузить данные проекта");
        router.push("/projects");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Преобразуем площадь в число
      const projectData = {
        ...formData,
        area: formData.area ? parseFloat(formData.area) : null
      };

      await projectsService.updateProject(id, {
        ...projectData,
        area: projectData.area ?? undefined
      });
      // Используем window.location для навигации вместо router.push
      window.location.href = `/projects/${id}`;
    } catch (error) {
      console.error("Ошибка при обновлении проекта:", error);
      alert("Произошла ошибка при обновлении проекта");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Редактирование проекта</h1>
      
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
                    <SelectValue placeholder="Выберите стадию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ProjectStage.PREPROJECT}>Предпроектная</SelectItem>
                    <SelectItem value={ProjectStage.CONCEPT}>Концепция</SelectItem>
                    <SelectItem value={ProjectStage.WORKING}>Рабочая</SelectItem>
                    <SelectItem value={ProjectStage.SUPERVISION}>Авторский контроль</SelectItem>
                    <SelectItem value={ProjectStage.COMPLETION}>Комплектация</SelectItem>
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
            
            <div className="space-y-2">
              <Label htmlFor="demolition_info">Информация о демонтаже</Label>
              <Textarea 
                id="demolition_info" 
                name="demolition_info" 
                value={formData.demolition_info} 
                onChange={handleChange} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="construction_info">Информация о строительстве</Label>
              <Textarea 
                id="construction_info" 
                name="construction_info" 
                value={formData.construction_info} 
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
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}