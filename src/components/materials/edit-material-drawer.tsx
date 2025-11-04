'use client';

import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { materialsService } from '@/lib/services/materials';
import { Material, MaterialType } from '@/types';

interface EditMaterialDrawerProps {
  material: Material;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaterialUpdated: () => void;
}

export function EditMaterialDrawer({ material, open, onOpenChange, onMaterialUpdated }: EditMaterialDrawerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    type: '' as MaterialType,
    
    manufacturer: '',
    supplier: '',
    price: 0,
    unit: '',
    description: '',
    image_url: '',
    color: '',
    size: '',
    article: '',
    in_stock: true,
    tags: [] as string[],
  });

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name || '',
        type: material.type || ('' as MaterialType),
        manufacturer: material.manufacturer || '',
        supplier: material.supplier || '',
        price: material.price || 0,
        unit: material.unit || '',
        description: material.description || '',
        image_url: material.image_url || '',
        color: material.color || '',
        size: material.size || '',
        article: material.article || '',
        in_stock: material.in_stock ?? true,
        tags: material.tags || [],
      });
    }
  }, [material]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.type || !formData.manufacturer) {
      return;
    }

    try {
      setIsLoading(true);
      await materialsService.updateMaterial(material.id, formData);
      onMaterialUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Ошибка при обновлении материала:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const materialTypes = Object.values(MaterialType);
  const commonUnits = ['шт', 'м', 'м²', 'м³', 'кг', 'л', 'упак', 'комплект'];
  const commonCategories = [
    'Напольные покрытия',
    'Настенные покрытия',
    'Потолочные материалы',
    'Сантехника',
    'Электрика',
    'Мебель',
    'Аксессуары',
    'Краски и лаки',
    'Клеи и герметики',
    'Инструменты'
  ];

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[95vh]">
        <DrawerHeader>
          <DrawerTitle>Редактировать материал</DrawerTitle>
          <DrawerDescription>
            Внесите изменения в информацию о материале
          </DrawerDescription>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4">
          <form onSubmit={handleSubmit} className="space-y-6 pb-6">
            {/* Основная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Название *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Название материала"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-type">Тип *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="edit-category">Категория *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="edit-manufacturer">Производитель *</Label>
                <Input
                  id="edit-manufacturer"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  placeholder="Название производителя"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-supplier">Поставщик</Label>
                <Input
                  id="edit-supplier"
                  value={formData.supplier}
                  onChange={(e) => handleInputChange('supplier', e.target.value)}
                  placeholder="Название поставщика"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-article">Артикул</Label>
                <Input
                  id="edit-article"
                  value={formData.article}
                  onChange={(e) => handleInputChange('article', e.target.value)}
                  placeholder="Артикул материала"
                />
              </div>
            </div>

            {/* Цена и единица измерения */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Цена (₽)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-unit">Единица измерения</Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите единицу" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonUnits.map((unit) => (
                      <SelectItem key={unit} value={unit}>
                        {unit}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Дополнительные характеристики */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-color">Цвет</Label>
                <Input
                  id="edit-color"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  placeholder="Цвет материала"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-size">Размер</Label>
                <Input
                  id="edit-size"
                  value={formData.size}
                  onChange={(e) => handleInputChange('size', e.target.value)}
                  placeholder="Размер материала"
                />
              </div>
            </div>

            {/* Описание */}
            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Подробное описание материала"
                rows={3}
              />
            </div>

            {/* URL изображения */}
            <div className="space-y-2">
              <Label htmlFor="edit-image_url">URL изображения</Label>
              <Input
                id="edit-image_url"
                type="url"
                value={formData.image_url}
                onChange={(e) => handleInputChange('image_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Теги */}
            <div className="space-y-2">
              <Label>Теги</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Добавить тег"
                  className="flex-1"
                />
                <Button type="button" onClick={handleAddTag} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* В наличии */}
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-in_stock"
                checked={formData.in_stock}
                onCheckedChange={(checked) => handleInputChange('in_stock', checked)}
              />
              <Label htmlFor="edit-in_stock">В наличии</Label>
            </div>
          </form>
        </ScrollArea>

        <DrawerFooter>
          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}