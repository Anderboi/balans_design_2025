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
import { Material, Project, Contact, Company } from "@/types";

interface MaterialCardProps {
  material: Material;
  projects: Project[];
  viewMode: "grid" | "list";
  onMaterialUpdated: () => void;
  onMaterialDeleted: () => void;
  initialSuppliers: Contact[];
  initialSupplierCompanies: Company[];
}

export function MaterialCard({
  material,
  projects,
  viewMode,
  onMaterialUpdated,
  onMaterialDeleted,
  initialSuppliers,
  initialSupplierCompanies,
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
        <div className="glass-card w-full rounded-4xl overflow-clip p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-end space-x-4 flex-1 ">
              <div className="rounded-md overflow-clip">
                {material.image_url ? (
                  <img
                    src={material.image_url}
                    alt={material.name}
                    className="size-24 object-cover rounded-3xl"
                  />
                ) : (
                  <div className="size-24 bg-muted flex items-center justify-center rounded-3xl">
                    <Package className="size-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground">
                  {material.description?.toUpperCase()}
                </p>
                <h3 className="font-semibold text-xl truncate ">
                  {material.name}
                </h3>
                <p className="text-xs text-muted-foreground/80 capitalize">
                  {material.manufacturer?.toUpperCase()}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">{material.type}</Badge>

                  {/* {!material.in_stock && (
                    <Badge variant="destructive">Нет в наличии</Badge>
                  )} */}
                </div>
              </div>

              <div className="text-right flex flex-col justify-between h-full">
                {material.price && (
                  <p className="font-semibold text-lg">
                    {material.price} ₽{material.unit ? `/${material.unit}` : ""}
                  </p>
                )}
                {/* {material.article && (
                  <p className="text-sm text-muted-foreground">
                    Арт: {material.article}
                  </p>
                )} */}
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
        </div>

        <EditMaterialDrawer
          material={material}
          open={showEditDrawer}
          onOpenChange={setShowEditDrawer}
          onMaterialUpdated={onMaterialUpdated}
          initialSuppliers={initialSuppliers}
          initialSupplierCompanies={initialSupplierCompanies}
        />

        <AssignMaterialDialog
          material={material}
          projects={projects}
          open={showAssignDialog}
          onOpenChange={setShowAssignDialog}
          onMaterialAssigned={onMaterialUpdated}
        />

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Удалить материал?</AlertDialogTitle>
              <AlertDialogDescription>
                Вы уверены, что хотите удалить материал &rdquo;{material.name}
                &ldquo;? Это действие нельзя отменить.
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
      <Card className="w-full h-full flex flex-col rounded-4xl border-0 shadow-lg shadow-zinc-300/50">
        <CardContent className="flex-1">
          {material.image_url ? (
            <img
              src={material.image_url}
              alt={material.name}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
          ) : (
            <div className="w-full h-48 bg-muted rounded-xl flex items-center justify-center mb-4">
              <Package className="size-16 text-muted-foreground" />
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground/80">
              {material.description ? material.description : "-"}
            </p>
            <h3 className="font-semibold text-xl line-clamp-2">
              {material.name}
            </h3>
            <p className="text-xs text-muted-foreground/80">
              {material.manufacturer?.toUpperCase()}
            </p>

            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">{material.type}</Badge>

              {/* {!material.in_stock && (
                <Badge variant="destructive">Нет в наличии</Badge>
              )} */}
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
              // size="sm"
              onClick={handleAssignMaterial}
              className="flex-1 rounded-full cursor-pointer"
            >
              <Plus className="size-4 mr-1" />
              Присвоить
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="cursor-pointer rounded-full">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowEditDrawer(true)}>
                  <Edit className="size-4 mr-2" />
                  Редактировать
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive"
                >
                  <Trash2 className="size-4 mr-2" />
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
        initialSuppliers={initialSuppliers}
        initialSupplierCompanies={initialSupplierCompanies}
      />

      <AssignMaterialDialog
        material={material}
        projects={projects}
        open={showAssignDialog}
        onOpenChange={setShowAssignDialog}
        onMaterialAssigned={onMaterialUpdated}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить материал?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить материал &quot;{material.name}
              &quot;? Это действие нельзя отменить.
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
