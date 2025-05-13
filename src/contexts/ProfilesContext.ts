import { Profile } from "@/types/types";
import { createContext } from "react";


export const ProfileContext = createContext<{ profiles:Profile[]; setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>; }  >({
    profiles: [],
    setProfiles: () => {},
  });