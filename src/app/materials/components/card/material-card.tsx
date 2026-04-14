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
import Image from "next/image";

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

  //? LIST view
  if (viewMode === "list") {
    return (
      <>
        <div className="glass-card flex items-center justify-between w-full rounded-2xl sm:rounded-4xl overflow-clip sm:p-2 gap-2 sm:gap-4">
          <div className="flex items-end space-x-2 sm:space-x-4 flex-1 ">
            {/*//? Image */}
            <div className="h-26 sm:rounded-3xl border border-muted overflow-clip">
              {material.image_url ? (
                <Image
                  src={material.image_url}
                  alt={material.name}
                  width={96}
                  height={96}
                  className="size-26 object-cover "
                />
              ) : (
                <div className="size-26 bg-muted flex items-center justify-center">
                  <Package className="size-8 text-muted-foreground" />
                </div>
              )}
            </div>
            {/*//? Info */}
            <div className="flex-1 h-26 flex flex-col justify-between min-w-0 py-2 sm:py-0">
              <p className="text-xs sm:text-sm text-muted-foreground h-lh">
                {material.description?.toUpperCase()}
              </p>
              <div>
                <h3 className="font-semibold sm:text-xl truncate ">
                  {material.name}
                </h3>
                <p className="text-xs text-muted-foreground/80 capitalize">
                  {material.manufacturer?.toUpperCase()}
                </p>
              </div>
            </div>
            {/*//? Price */}
            <div className="text-right h-26 pb-2 flex items-end flex-col justify-between font-semibold sm:text-lg">
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="secondary">{material.type}</Badge>

                {/* {!material.in_stock && (
                    <Badge variant="destructive">Нет в наличии</Badge>
                  )} */}
              </div>
              {material.price && (
                <p>
                  {material.price} ₽{material.unit ? `/${material.unit}` : ""}
                </p>
              )}
            </div>
          </div>

          {/*//? Action buttons */}
          <div className="flex flex-col h-26 p-2 justify-between //hidden items-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="cursor-pointer rounded-full"
                >
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
            <Button
              variant="outline"
              onClick={handleAssignMaterial}
              className="flex max-sm:size-10 items-center rounded-full cursor-pointer"
            >
              <Plus className="size-4" />
              <span className="hidden sm:flex">Присвоить</span>
            </Button>
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

  //? GRID view
  return (
    <>
      <Card className=" glass-card w-full h-full flex relative max-sm:p-0 flex-col sm:rounded-4xl border-0 shadow-lg shadow-zinc-300/50 overflow-clip">
        <CardContent className="flex-1 max-sm:p-0">
          <div className="flex sm:hidden justify-between absolute w-full sm:w-[calc(100%-32px)] p-2 sm:p-0 opacity-80">
            <Button
              variant="outline"
              size="icon-lg"
              onClick={handleAssignMaterial}
              className="cursor-pointer rounded-full"
            >
              <Plus className="size-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon-lg"
                  className="cursor-pointer rounded-full"
                >
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

          {material.image_url ? (
            <Image
              src={material.image_url}
              alt={material.name}
              width={196}
              height={196}
              loading="eager"
              className="w-full h-49 sm:w-full object-cover sm:rounded-xl mb-2 sm:mb-4"
            />
          ) : (
            <div className="w-full h-49 sm:w-full bg-muted sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4">
              <Package className="size-16 text-muted-foreground" />
            </div>
          )}

          <div className="sm:space-y-2 px-2 sm:px-0">
            <p className="text-xs sm:text-sm text-muted-foreground/80">
              {material.description ? material.description : "-"}
            </p>
            <h3 className="font-semibold sm:text-xl h-[2lh] leading-5 line-clamp-2">
              {material.name}
            </h3>
            <p className="text-xs text-muted-foreground/80">
              {material.manufacturer?.toUpperCase()}
            </p>

            <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
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

        <CardFooter className="pt-0 sm:pb-0 flex flex-col space-y-2">
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

          <div className="hidden sm:flex sm:space-x-4 items-center sm:w-full">
            <Button
              variant="outline"
              size="lg"
              onClick={handleAssignMaterial}
              className="left-2 sm:flex-1 rounded-full cursor-pointer"
            >
              <Plus className="size-4 hidden sm:flex mr-1" />
              <span>Присвоить</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className="cursor-pointer rounded-full"
                >
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
