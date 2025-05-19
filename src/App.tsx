import "@fontsource/ubuntu/700.css";

import { useState } from "react";
import "./index.css";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import Backup from "./tabs/Backup";
import AddProfile from "./tabs/AddProfile";
import { Menu, Profile, TabRoute } from "@/types/types";
import { TABS } from "@/types/enums";
import Profiles from "./tabs/Profiles";
import { Toaster } from "sonner";
import History from "./tabs/History";
import { AppProvider } from "./contexts/AppProvider";
// import { CheckUpdater } from "./components/Updater";


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
  const [currentTab, setCurrentTab] = useState<TabRoute>({ tab: TABS.RUNBACKUP });
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isBackupRunning, setIsBackupRunning] = useState<boolean>(false)

  return (
    <AppProvider isBackupRunning={isBackupRunning} setIsBackupRunning={setIsBackupRunning} currentTab={currentTab} setCurrentTab={setCurrentTab} profiles={profiles} setProfiles={setProfiles}>
     {/* <CheckUpdater />  */}
      <SidebarProvider>
        <div className="flex h-screen w-full ">
          <AppSidebar menu={menu} />
          <SidebarInset>
            {currentTab.tab == TABS.RUNBACKUP && <Backup />}
            {currentTab.tab == TABS.PROFILES && <Profiles />}
            {currentTab.tab == TABS.ADDBACKUPPROFILE && <AddProfile />}
            {currentTab.tab == TABS.HISTORY && <History />}
            <Toaster />
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AppProvider>
  );
}

export default App;
