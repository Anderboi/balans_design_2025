'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { projectsService } from '@/lib/services/projects';
import { materialsService } from '@/lib/services/materials';
import { Material, Project, Room } from '@/types';

interface AssignMaterialDialogProps {
  material: Material;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialAssigned: () => void;
}

export function AssignMaterialDialog({ material, open, onOpenChange, onMaterialAssigned }: AssignMaterialDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (open) {
      loadProjects();
    }
  }, [open]);

  useEffect(() => {
    if (selectedProjectId) {
      loadRooms(selectedProjectId);
    } else {
      setRooms([]);
      setSelectedRoomId('');
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const projectsData = await projectsService.getProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Ошибка при загрузке проектов:', error);
    }
  };

  const loadRooms = async (projectId: string) => {
    try {
      const roomsData = await projectsService.getRooms(projectId);
      setRooms(roomsData);
    } catch (error) {
      console.error('Ошибка при загрузке помещений:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProjectId || !selectedRoomId || quantity <= 0) {
      return;
    }

    try {
      setIsLoading(true);
      
      await materialsService.addSpecification({
        project_id: selectedProjectId,
        room_id: selectedRoomId,
        material_id: material.id,
        quantity,
        notes: notes.trim() || '',
      });

      onMaterialAssigned();
      onOpenChange(false);
      
      // Сброс формы
      setSelectedProjectId('');
      setSelectedRoomId('');
      setQuantity(1);
      setNotes('');
    } catch (error) {
      console.error('Ошибка при присвоении материала:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Сброс формы
    setSelectedProjectId('');
    setSelectedRoomId('');
    setQuantity(1);
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Присвоить материал проекту</DialogTitle>
          <DialogDescription>
            Выберите проект и помещение для материала "{material.name}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Выбор проекта */}
          <div className="space-y-2">
            <Label htmlFor="project">Проект *</Label>
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите проект" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Выбор помещения */}
          <div className="space-y-2">
            <Label htmlFor="room">Помещение *</Label>
            <Select 
              value={selectedRoomId} 
              onValueChange={setSelectedRoomId}
              disabled={!selectedProjectId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите помещение" />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Количество */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Количество *</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                placeholder="1"
                className="flex-1"
                required
              />
              {material.unit && (
                <span className="text-sm text-muted-foreground min-w-fit">
                  {material.unit}
                </span>
              )}
            </div>
          </div>

          {/* Примечания */}
          <div className="space-y-2">
            <Label htmlFor="notes">Примечания</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Дополнительные заметки о применении материала"
              rows={3}
            />
          </div>

          {/* Информация о материале */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <div className="text-sm space-y-1">
              <div><strong>Материал:</strong> {material.name}</div>
              <div><strong>Тип:</strong> {material.type}</div>
              <div><strong>Производитель:</strong> {material.manufacturer}</div>
              {material.price && (
                <div><strong>Цена:</strong> {material.price} ₽{material.unit ? `/${material.unit}` : ''}</div>
              )}
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel}>
            Отмена
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !selectedProjectId || !selectedRoomId || quantity <= 0}
          >
            {isLoading ? 'Присваивание...' : 'Присвоить материал'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}