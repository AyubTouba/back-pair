
import { ReactNode } from "react";
import { CurrentTabContext } from "./CurrentTabContext";
import { ProfileContext } from "./ProfilesContext";
import { Profile, TabRoute } from "@/types/types";
import { BackupContext } from "./BackupContext";

type AppProviderProps = {
    children: ReactNode;
    setCurrentTab: React.Dispatch<React.SetStateAction<TabRoute>>,
    currentTab: TabRoute,
    profiles: Profile[],
    setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>,
    isBackupRunning: boolean,
    setIsBackupRunning: React.Dispatch<React.SetStateAction<boolean>>,
};

export function AppProvider({ children, currentTab, setCurrentTab, profiles, setProfiles, isBackupRunning, setIsBackupRunning }: AppProviderProps) {

    return (
        <CurrentTabContext.Provider value={{ currentTab, setCurrentTab }} >
            <ProfileContext.Provider
                value={{
                    profiles,
                    setProfiles
                }}
            >
                <BackupContext.Provider value={{
                    isBackupRunning,
                    setIsBackupRunning
                }}>
                    {children}

                </BackupContext.Provider>
            </ProfileContext.Provider>
        </CurrentTabContext.Provider>
    );
}