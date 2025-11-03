import React from "react";
import {
  Book,
  BriefcaseBusiness,
  ChevronUp,
  Home,
  Image,
  Package,
  SquareUser,
  UserCircleIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

//? Menu items
const mainItems = [
  {
    title: "Дашборд",
    href: "/",
    icon: Home,
  },
  {
    title: "Проекты",
    href: "/projects",
    icon: BriefcaseBusiness,
  },
];
const libraryItems = [
  {
    title: "Материалы",
    href: "/materials",
    icon: Package,
  },
  {
    title: "Контакты",
    href: "/contacts",
    icon: SquareUser,
  },
  {
    title: "База знаний",
    href: "/knowledge",
    icon: Book,
  },
  {
    title: "Галлерея изображений",
    href: "/gallery",
    icon: Image,
  },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-3xl font-bold p-2">BALANS</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Библиотеки</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {libraryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={"lg"}>
                  <UserCircleIcon />
                  UserName
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Профиль</span>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
