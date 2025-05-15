import { createContext } from "react";


export const BackupContext = createContext<{ isBackupRunning:boolean; setIsBackupRunning: React.Dispatch<React.SetStateAction<boolean>>; }  >({
    isBackupRunning: false,
    setIsBackupRunning: () => {},
  });