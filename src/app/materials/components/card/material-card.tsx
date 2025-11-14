"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Plus, Package } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { EditMaterialDrawer } from "../edit-material-drawer";
import { AssignMaterialDialog } from "../assign-material-dialog";
import { materialsService } from "@/lib/services/materials";
import { Material } from "@/types";

interface MaterialCardProps {
  material: Material;
  viewMode: "grid" | "list";
  onMaterialUpdated: () => void;
  onMaterialDeleted: () => void;
}

export function MaterialCard({
  material,
  viewMode,
  onMaterialUpdated,
  onMaterialDeleted,
}: MaterialCardProps) {
  const [showEditDrawer, setShowEditDrawer] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await materialsService.deleteMaterial(material.id);
      onMaterialDeleted();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Ошибка при удалении материала:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignMaterial = () => {
    setShowAssignDialog(true);
  };

  if (viewMode === "list") {
    return (
      <>
        <Card className="w-full">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {material.image_url ? (
                  <img
                    src={material.image_url}
                    alt={material.name}
                    className="w-18 h-18 object-cover rounded-sm"
                  />
                ) : (
                  <div className="w-18 h-18 bg-muted rounded-sm flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xl truncate ">
                    {material.name}
                  </h3>
                  <p className="text-xs text-muted-foreground/80 capitalize">
                    {material.manufacturer?.toUpperCase()}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary">{material.type}</Badge>

                    {!material.in_stock && (
                      <Badge variant="destructive">Нет в наличии</Badge>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  {material.price && (
                    <p className="font-semibold text-lg">
                      {material.price} ₽
                      {material.unit ? `/${material.unit}` : ""}
                    </p>
                  )}
                  {material.article && (
                    <p className="text-sm text-muted-foreground">
                      Арт: {material.article}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAssignMaterial}
                  className="flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Присвоить</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditDrawer(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Редактировать
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        <EditMaterialDrawer
          material={material}
          open={showEditDrawer}
          onOpenChange={setShowEditDrawer}
          onMaterialUpdated={onMaterialUpdated}
        />

        <AssignMaterialDialog
          material={material}
          open={showAssignDialog}
          onOpenChange={setShowAssignDialog}
          onMaterialAssigned={onMaterialUpdated}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить материал?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить материал "{material.name}"? Это
                действие нельзя отменить.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Удаление..." : "Удалить"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <>
      <Card className="w-full h-full flex flex-col">
        <CardContent className="/p-4 flex-1">
          {material.image_url ? (
            <img
              src={material.image_url}
              alt={material.name}
              className="w-full h-48 object-cover rounded-sm mb-4"
            />
          ) : (
            <div className="w-full h-48 bg-muted rounded-sm flex items-center justify-center mb-4">
              <Package className="w-16 h-16 text-muted-foreground" />
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold text-lg line-clamp-2">
              {material.name}
            </h3>
            <p className="text-xs text-muted-foreground/80">
              {material.manufacturer?.toUpperCase()}
            </p>

            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">{material.type}</Badge>

              {!material.in_stock && (
                <Badge variant="destructive">Нет в наличии</Badge>
              )}
            </div>

            {material.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {material.description}
              </p>
            )}

            {material.tags && material.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {material.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {material.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{material.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 flex flex-col space-y-2">
          <div className="flex justify-end items-center w-full">
            {material.price ? (
              <span className="font-semibold">
                {material.price} ₽{material.unit ? `/${material.unit}` : ""}
              </span>
            ) : (
              <span className="text-muted-foreground">Цена не указана</span>
            )}

            {material.article && (
              <span className="text-sm text-muted-foreground">
                Арт: {material.article}
              </span>
            )}
          </div>

          <div className="flex space-x-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAssignMaterial}
              className="flex-1"
            >
              <Plus className="w-4 h-4 mr-1" />
              Присвоить
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDrawer(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardFooter>
      </Card>

      <EditMaterialDrawer
        material={material}
        open={showEditDrawer}
        onOpenChange={setShowEditDrawer}
        onMaterialUpdated={onMaterialUpdated}
      />

      <AssignMaterialDialog
        material={material}
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        onMaterialAssigned={onMaterialUpdated}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить материал?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить материал "{material.name}"? Это
              действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
