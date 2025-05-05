import { TABS } from "@/types/enums";
import { TabRoute } from "@/types/types";
import { createContext } from "react";

export const CurrentTabContext = createContext<{ currentTab:TabRoute; setCurrentTab: React.Dispatch<React.SetStateAction<TabRoute>>; }  >({
    currentTab: {tab:TABS.RUNBACKUP},
    setCurrentTab: () => {},
  });