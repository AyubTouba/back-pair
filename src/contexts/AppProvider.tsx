
import { ReactNode } from "react";
import { CurrentTabContext } from "./CurrentTabContext";
import { ProfileContext } from "./ProfilesContext";
import { Profile, TabRoute } from "@/types/types";

type AppProviderProps = {
    children: ReactNode;
    setCurrentTab: React.Dispatch<React.SetStateAction<TabRoute>>,
    currentTab: TabRoute,
    profiles: Profile[] ,
    setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>
};

export function AppProvider({ children, currentTab, setCurrentTab, profiles, setProfiles }: AppProviderProps) {

    return (
        <CurrentTabContext.Provider value={{ currentTab, setCurrentTab }} >
            <ProfileContext.Provider
                value={{
                    profiles,
                    setProfiles
                }}
            >
                {children}
            </ProfileContext.Provider>
        </CurrentTabContext.Provider>
    );
}