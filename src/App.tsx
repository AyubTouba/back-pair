import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import "./index.css";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import RunBackup from "./tabs/RunBackup";
import AddProfile from "./tabs/AddProfile";
import { Menu } from "@/types/types";
import { TABS } from "@/types/enums";
import Profiles from "./tabs/Profiles";
import { Toaster } from "sonner";


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
  // const [greetMsg, setGreetMsg] = useState("");
  // const [name, setName] = useState("");
  const [currentTab, setCurrentTab] = useState<TABS>(TABS.RUNBACKUP);
  // async function greet() {
  //   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
  //   setGreetMsg(await invoke("greet", { name }));
  // }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full ">
        <AppSidebar currentTab={currentTab} menu={menu} setCurrentTab={setCurrentTab} />
        <SidebarInset>
          {currentTab == TABS.RUNBACKUP && <RunBackup />}
          {currentTab == TABS.PROFILES && <Profiles />}
          {currentTab == TABS.ADDBACKUPPROFILE && <AddProfile />}
          <Toaster />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

export default App;
