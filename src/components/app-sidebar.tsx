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
import { Menu } from "@/types/types";
import { CurrentTabContext } from "@/contexts/CurrentTabContext";
import { useContext } from 'react';
import { cn } from '@/lib/utils';
import { BackupContext } from '@/contexts/BackupContext';
import logo from '@/assets/logo.png';
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  menu: Menu,
}

type CombinedProps = React.ComponentProps<typeof Sidebar> & AppSidebarProps;

export function AppSidebar({ menu, ...props }: CombinedProps) {
  const { currentTab, setCurrentTab } = useContext(CurrentTabContext);
  const { isBackupRunning } = useContext(BackupContext);
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2 pt-3">
          <img src={logo} className="h-7 w-7 text-primary" alt="BackPair Logo" />
          <div className="font-bold text-lg tracking-tight">BackPair</div>
        </div>
        <Separator className="mt-2" />
      </SidebarHeader>
      <SidebarContent className="px-1.5">
        {menu.navMain.map((group, index) => (
          <SidebarGroup key={group.title} className={cn(index > 0 ? "mt-2" : "mt-0")}>
            <SidebarGroupLabel className="uppercase text-[11px] tracking-wider text-muted-foreground/70 font-medium pb-2">
              <div className="flex items-center gap-2">
                {group.icon && <group.icon className="h-3.5 w-3.5" />}
                {group.title}
              </div>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const isActive = item.tab === currentTab.tab;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        className={cn(
                          "py-1.5 transition-colors text-sm",
                          isActive
                            ? "bg-primary/10 text-primary border-l-2 border-primary rounded-l-none font-semibold hover:bg-primary/15 hover:text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 font-medium",
                          isBackupRunning && "cursor-not-allowed opacity-50 pointer-events-none"
                        )}
                        asChild
                        isActive={isActive}
                      >
                        <span onClick={() => !isBackupRunning && setCurrentTab({ tab: item.tab })}>
                          <div className="flex items-center gap-2 w-full">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.title}
                          </div>
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <Separator className="mb-2" />
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="text-[10px] text-muted-foreground/60">
            v{packageJson.version}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-accent/50"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar >
  )
}
