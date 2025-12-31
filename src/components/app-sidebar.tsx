import {
  BriefcaseBusiness,
  Home,
  Package,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import Link from "next/link";
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

const AppSidebar = async () => {
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
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="rounded-xl px-3 text-gray-500 hover:text-black hover:bg-gray-50 data-[active=true]:bg-black data-[active=true]:text-white transition-all duration-200 group-data-[collapsible=icon]:px-2"
                  >
                    <Link href={item.href}>
                      <item.icon className="!size-5 shrink-0" />
                      <span className="font-medium text-[15px] overflow-hidden whitespace-nowrap transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 gap-4 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="rounded-xl px-3 text-gray-500 hover:text-black hover:bg-gray-50 transition-all duration-200 group-data-[collapsible=icon]:px-2"
            >
              <Link href="/settings">
                <Settings className="!size-5 shrink-0" />
                <span className="font-medium text-[15px] overflow-hidden whitespace-nowrap transition-all duration-200 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
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
