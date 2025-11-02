"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { projectsService } from "@/lib/services/projects";
import { ProjectStage } from "@/types";

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    area: "",
    stage: ProjectStage.PREPROJECT,
    residents: "",
    demolition_info: "",
    construction_info: ""
  });

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
        area: formData.area ? parseFloat(formData.area) : null,
      };

      await projectsService.createProject(projectData);
      router.push("/projects");
      router.refresh();
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
                {isLoading ? "Сохранение..." : "Создать проект"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}