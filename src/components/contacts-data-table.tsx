"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Pen } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Contact } from "@/types";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Label } from "./ui/label";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { contactsService } from "@/lib/services/contacts";
import { getInitials } from '@/lib/utils';



export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost" className='text-xs'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Имя
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback className="text-xs">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <span>{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: "Должность",
    cell: ({ row }) => (
      <div className="text-muted-foreground">
        {row.getValue("position") || "-"}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return (
        <a
          href={`mailto:${email}`}
          className="text-blue-600 hover:underline"
        >
          {email}
        </a>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Телефон",
    cell: ({ row }) => (
      <div>
        {row.getValue("phone") || (
          <span className="text-muted-foreground">-</span>
        )}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const contact = row.original;
      const [isOpen, setIsOpen] = useState(false);
      const [isLoading, setIsLoading] = useState(false);
      const [formData, setFormData] = useState({
        name: contact.name,
        position: contact.position || "",
        email: contact.email,
        phone: contact.phone || "",
      });

      // Определяем направление Drawer в зависимости от размера экрана
      const [drawerDirection, setDrawerDirection] = useState<"right" | "bottom">("right");

      React.useEffect(() => {
        const checkScreenSize = () => {
          if (window.innerWidth < 768) {
            setDrawerDirection("bottom");
          } else {
            setDrawerDirection("right");
          }
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
      }, []);

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSelectChange = (value: string) => {
        setFormData(prev => ({ ...prev, position: value }));
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
          await contactsService.updateContact(contact.id, {
            name: formData.name,
            position: formData.position,
            email: formData.email,
            phone: formData.phone,
          });
          
          // Обновляем данные в таблице
          Object.assign(contact, formData);
          setIsOpen(false);
          
          // Можно добавить toast уведомление об успешном обновлении
          console.log('Контакт успешно обновлен');
        } catch (error) {
          console.error('Ошибка при обновлении контакта:', error);
          // Можно добавить toast уведомление об ошибке
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <Drawer open={isOpen} onOpenChange={setIsOpen} direction={drawerDirection}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full h-6 w-6 p-0 hover:cursor-pointer"
            >
              <span className="sr-only">Open menu</span>
              <Pen size={8} fontSize={8} className="text-neutral-400" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-6 gap-4">
            <DrawerHeader className="p-0">
              <DrawerTitle>Изменить контакт</DrawerTitle>
              <DrawerDescription>
                Вы можете изменить имя, роль, email и телефон в полях ниже.
              </DrawerDescription>
            </DrawerHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Имя</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Имя"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="position">Должность</Label>
                <Select value={formData.position} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите должность" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Менеджер">Менеджер</SelectItem>
                    <SelectItem value="Директор">Директор</SelectItem>
                    <SelectItem value="Главный инженер">Главный инженер</SelectItem>
                    <SelectItem value="Архитектор">Архитектор</SelectItem>
                    <SelectItem value="Дизайнер">Дизайнер</SelectItem>
                    <SelectItem value="Прораб">Прораб</SelectItem>
                    <SelectItem value="Снабженец">Снабженец</SelectItem>
                    <SelectItem value="Бухгалтер">Бухгалтер</SelectItem>
                    <SelectItem value="Секретарь">Секретарь</SelectItem>
                    <SelectItem value="Другое">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Сохранение..." : "Сохранить"}
              </Button>
            </form>
          </DrawerContent>
        </Drawer>
      );
    },
  },
];

interface ContactsDataTableProps {
  data: Contact[];
}

export function ContactsDataTable({ data }: ContactsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Найти контакт..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader className='bg-neutral-100 text-xs'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className='text-xs'>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Назад
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Делее
          </Button>
        </div>
      </div> */}
    </div>
  );
}
