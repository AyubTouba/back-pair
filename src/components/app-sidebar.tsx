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
import { Menu } from "@/types/types";
import { CurrentTabContext } from "@/contexts/CurrentTabContext";
import { useContext } from 'react';
import { cn } from '@/lib/utils';
import { BackupContext } from '@/contexts/BackupContext';


interface AppSidebarProps {
  menu: Menu,
}

type CombinedProps = React.ComponentProps<typeof Sidebar> & AppSidebarProps;

export function AppSidebar({ menu, ...props }: CombinedProps) {
  const { currentTab, setCurrentTab } = useContext(CurrentTabContext);
  const { isBackupRunning } = useContext(BackupContext);

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
                    <SidebarMenuButton className={cn({ 'hover:cursor-pointer': !isBackupRunning, 'hover:cursor-not-allowed': isBackupRunning })} asChild isActive={item.tab == currentTab.tab}>
                      <span onClick={() => !isBackupRunning && setCurrentTab({ tab: item.tab })}>{item.title}</span>
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
