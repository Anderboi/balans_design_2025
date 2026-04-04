"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { projectsService } from "@/lib/services/projects";

export default function DeleteProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await projectsService.getProjectById(id);
        setProject(projectData);
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await projectsService.deleteProject(id);
      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Произошла ошибка при удалении проекта");
      setIsDeleting(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Удаление проекта</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Подтверждение удаления</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Вы уверены, что хотите удалить проект "{project?.name}"?</p>
          <p className="text-red-600 font-medium">Это действие невозможно отменить. Все данные проекта, включая помещения, задачи и спецификации, будут удалены.</p>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isDeleting}
          >
            Отмена
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Удаление..." : "Удалить проект"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}