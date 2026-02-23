"use client";

import {
  BriefcaseBusiness,
  Home,
  Package,
  PlusCircle,
  Settings,
  Users,
  LayoutDashboard,
  FileText,
  PenTool,
  Image as ImageIcon,
  Box,
  Ruler,
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
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { CreateProjectDialog } from "./create-project-dialog";

//? Menu items
const items = [
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
  {
    title: "Материалы",
    href: "/materials",
    icon: Package,
  },
  {
    title: "Контакты",
    href: "/contacts",
    icon: Users,
  },
];

const AppSidebar = () => {
  const pathname = usePathname();

  const projectMatch = pathname.match(/^\/projects\/([a-f0-9-]+)/);
  const projectId = projectMatch ? projectMatch[1] : null;

  const projectItems = projectId
    ? [
        {
          title: "Обзор проекта",
          href: `/projects/${projectId}`,
          exact: true,
          icon: LayoutDashboard,
        },
        {
          title: "ТЗ",
          href: `/projects/${projectId}/brief`,
          exact: false,
          icon: FileText,
        },
        {
          title: "Планировки",
          href: `/projects/${projectId}/planning`,
          exact: false,
          icon: PenTool,
        },
        {
          title: "Коллажи",
          href: `/projects/${projectId}/collages`,
          exact: false,
          icon: ImageIcon,
        },
        {
          title: "3D Визуализации",
          href: `/projects/${projectId}/visualizations`,
          exact: false,
          icon: Box,
        },
        {
          title: "Чертежи",
          href: `/projects/${projectId}/drawings`,
          exact: false,
          icon: Ruler,
        },
      ]
    : [];

  return (
    <Sidebar collapsible="icon" className="bg-white border-r border-gray-100">
      <SidebarHeader className="py-6 px-4 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center gap-2 px-2 transition-all duration-200 group-data-[collapsible=icon]:px-0">
          <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-black text-white shrink-0">
            <span className="font-bold text-xs">A</span>
          </div>
          <span className="font-semibold text-lg tracking-tight overflow-hidden whitespace-nowrap transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
            BALANS
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-1">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : // If we are in a project, don't highlight the global "Projects" tab to avoid confusion with the project sub-menu
                      item.href === "/projects" && projectId
                      ? false
                      : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      isActive={isActive}
                      className="rounded-lg px-3 text-zinc-500 hover:text-black hover:bg-zinc-100 data-[active=true]:bg-zinc-200 data-[active=true]:text-black transition-all duration-200 group-data-[collapsible=icon]:px-2"
                    >
                      <Link href={item.href}>
                        <item.icon className="size-5! shrink-0" />
                        <span className="font-medium text-base overflow-hidden whitespace-nowrap transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                          {item.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {projectId && (
          <SidebarGroup className="mt-4 border-t border-gray-100 pt-4">
            <SidebarGroupLabel className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 transition-all duration-200 group-data-[collapsible=icon]:opacity-0">
              Разделы проекта
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {projectItems.map((item) => {
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        size="default"
                        isActive={isActive}
                        className="rounded-lg px-3 text-zinc-600 hover:text-black hover:bg-zinc-50 data-[active=true]:bg-black data-[active=true]:text-white transition-all duration-200 group-data-[collapsible=icon]:px-2"
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4! shrink-0" />
                          <span className="font-medium text-sm overflow-hidden whitespace-nowrap transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 gap-4 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              isActive={pathname.startsWith("/settings")}
              className="rounded-lg px-3 text-zinc-500 hover:text-black hover:bg-zinc-100 data-[active=true]:bg-zinc-200 data-[active=true]:text-black transition-all duration-200 group-data-[collapsible=icon]:px-2"
            >
              <Link href="/settings">
                <Settings className="size-5! shrink-0" />
                <span className="font-medium text-base overflow-hidden whitespace-nowrap transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                  Настройки
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2 pb-2 group-data-[collapsible=icon]:px-0">
          <CreateProjectDialog>
            <Button className="w-full rounded-full bg-black hover:bg-gray-800 text-white shadow-lg h-12 flex items-center justify-start px-4 gap-3 group transition-all duration-200 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto">
              <PlusCircle className="size-6 text-white/90 shrink-0" />
              <span className="font-medium overflow-hidden whitespace-nowrap transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                Новый проект
              </span>
            </Button>
          </CreateProjectDialog>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
