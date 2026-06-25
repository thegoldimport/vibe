"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Search,
  Settings,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Command,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const params = useParams();
  const pathname = usePathname();
  const agencyId = params.id as string;

  const data = {
    user: {
      name: "Owner",
      email: "owner@agency.com",
      avatar: "/avatars/user.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: `/agency/${agencyId}`,
        icon: LayoutDashboard,
        isActive: pathname === `/agency/${agencyId}`,
      },
      {
        title: "Leads",
        url: `/agency/${agencyId}/leads`,
        icon: Search,
        isActive: pathname.includes("/leads"),
        items: [
          {
            title: "Find Leads",
            url: `/agency/${agencyId}/leads/find`,
          },
          {
            title: "All Leads",
            url: `/agency/${agencyId}/leads`,
          },
        ],
      },
      {
        title: "Clients",
        url: `/agency/${agencyId}/clients`,
        icon: Users,
        isActive: pathname.includes("/clients"),
      },
      {
        title: "Team",
        url: `/agency/${agencyId}/team`,
        icon: ShieldCheck,
        isActive: pathname.includes("/team"),
      },
    ],
  };

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-border/50 bg-sidebar/50 backdrop-blur-xl">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold text-foreground">VibeAgency</span>
                <span className="truncate text-xs text-muted-foreground">Pro Plan</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.items ? (
                <>
                  <SidebarMenuButton tooltip={item.title} isActive={item.isActive}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton render={<Link href={subItem.url} />} isActive={pathname === subItem.url}>
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </>
              ) : (
                <SidebarMenuButton render={<Link href={item.url} />} tooltip={item.title} isActive={item.isActive}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton render={<Link href={`/agency/${agencyId}/settings`} />} isActive={pathname.includes("/settings")}>
              <Settings className="size-4" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <div className="mx-2 mt-4 rounded-xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent p-4 border border-primary/20 group-data-[collapsible=icon]:hidden">
                <div className="flex items-center gap-2 mb-2">
                   <Sparkles className="size-4 text-primary animate-pulse" />
                   <span className="text-xs font-medium text-foreground">AI CEO Active</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
                   Your AI CEO is currently analyzing 12 new leads found in your area.
                </p>
                <button className="text-[10px] font-medium text-primary hover:underline">
                   View CEO Report
                </button>
             </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
