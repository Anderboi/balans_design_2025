'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { projectsService } from '@/lib/services/projects';
import { Project } from '@/types';

interface ProjectsListProps {
  initialProjects?: Project[];
}

export default function ProjectsList({ initialProjects = [] }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Ошибка при загрузке проектов:', err);
        throw err; // Бросаем ошибку для обработки error boundary
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if initialProjects is empty (for client-side navigation)
    if (initialProjects.length === 0) {
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, [initialProjects.length]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Проекты</h1>
          <Button asChild>
            <Link href="/projects/new">Создать проект</Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-full animate-pulse">
              <CardHeader>
                <CardTitle className="h-6 bg-muted rounded w-3/4"></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    throw new Error(error); // This will be caught by the error boundary
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Проекты</h1>
        <Button asChild>
          <Link href="/projects/new">Создать проект</Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Link href={`/projects/${project.id}`} key={project.id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><span className="font-medium">Адрес:</span> {project.address}</p>
                    <p><span className="font-medium">Площадь:</span> {project.area} м²</p>
                    <p><span className="font-medium">Стадия:</span> {project.stage}</p>
                    <p><span className="font-medium">Клиент:</span> {project.client_id ? 'Загружается на странице проекта' : '—'}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-muted-foreground">Проекты не найдены. Создайте новый проект.</p>
          </div>
        )}
      </div>
    </div>
  );
}