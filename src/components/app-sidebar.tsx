import * as React from "react"
import packageJson from '../../package.json';

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
} from "@/components/ui/sidebar"
import { Shield } from "lucide-react"
import { TABS } from "@/types/enums";
import { Menu } from "@/types/types";


interface AppSidebarProps {
  currentTab: TABS;
  menu: Menu,
  setCurrentTab: (tab: TABS) => void
}

type CombinedProps = React.ComponentProps<typeof Sidebar> & AppSidebarProps;

export function AppSidebar({ currentTab, setCurrentTab, menu, ...props }: CombinedProps) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Shield className="h-6 w-6 text-primary" />
          <div className="font-semibold text-xl">BackPair</div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {menu.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.tab == currentTab}>
                      <span onClick={() => setCurrentTab(item.tab)}>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2 text-xs text-muted-foreground">BackPair  V {packageJson.version}</div>
      </SidebarFooter>
    </Sidebar >
  )
}
