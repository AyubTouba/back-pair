import "@fontsource/ubuntu/700.css";

import { useState } from "react";
import "./index.css";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import RunBackup from "./tabs/RunBackup";
import AddProfile from "./tabs/AddProfile";
import { Menu, TabRoute } from "@/types/types";
import { TABS } from "@/types/enums";
import Profiles from "./tabs/Profiles";
import { Toaster } from "sonner";
import { CurrentTabContext } from "./contexts/CurrentTabContext";


const menu: Menu = {
  navMain: [
    {
      title: "Backup Profile",
      tab: TABS.PROFILES,
      items: [
        {
          title: "Add Profile",
          tab: TABS.ADDBACKUPPROFILE,
        },
        {
          title: "Profiles",
          tab: TABS.PROFILES,
        },
      ],
    },
    {
      title: "Backup",
      tab: TABS.RUNBACKUP,
      items: [
        {
          title: "Run Backup",
          tab: TABS.RUNBACKUP,
        },
        {
          title: "History",
          tab: TABS.HISTORY,
        },
      ],
    },
  ],
}

function App() {
  const [currentTab, setCurrentTab] = useState<TabRoute>({tab:TABS.RUNBACKUP});

  return (
    <CurrentTabContext.Provider value={{currentTab,setCurrentTab}} >
    <SidebarProvider>
      <div className="flex h-screen w-full ">
        <AppSidebar menu={menu} />
        <SidebarInset>
          {currentTab.tab == TABS.RUNBACKUP && <RunBackup />}
          {currentTab.tab == TABS.PROFILES && <Profiles />}
          {currentTab.tab == TABS.ADDBACKUPPROFILE && <AddProfile />}
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
    </CurrentTabContext.Provider>
  );
}

export default App;
