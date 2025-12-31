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
      <SidebarHeader className="py-6 px-4">
        <div className="flex items-center gap-2 px-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-black text-white">
            <span className="font-bold text-xs">A</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">BALANS</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    size="lg"
                    className="rounded-xl px-4 text-gray-500 hover:text-black hover:bg-gray-50 data-[active=true]:bg-black data-[active=true]:text-white transition-colors"
                  >
                    <Link href={item.href}>
                      <item.icon className="!size-5" />
                      <span className="font-medium text-[15px]">
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
      <SidebarFooter className="p-4 gap-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              size="lg"
              className="rounded-xl px-4 text-gray-500 hover:text-black hover:bg-gray-50"
            >
              <Link href="/settings">
                <Settings className="!size-5" />
                <span className="font-medium text-[15px]">Настройки</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-2 pb-2">
          <Button className="w-full rounded-full bg-black hover:bg-gray-800 text-white shadow-lg h-12 flex items-center justify-start px-4 gap-3 group">
            <PlusCircle className="size-6 text-white/90" />
            <span className="font-medium group-data-[collapsible=icon]:hidden">
              Новый проект
            </span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
