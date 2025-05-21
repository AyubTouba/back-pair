import { TABS } from "./enums"

export type Menu = {
    navMain: NavMenu[]
  }

export type NavMenu = { title: string, tab: TABS,items: ItemMenu[]  }
export type ItemMenu = { title: string, tab: TABS}

export type FolderPair = {
    id: string
    from_folder: string
    to_folder: string
  }

export type Profile = {
   id: string,
   name_profile: string,
   created_at: string,
   lastBackup?:string,
   pairfolders:FolderPair[]
}

export type TabRoute = {
  tab:TABS,
  params?:any
}

export type BackupProgress = {
  totalFiles: number;
  copiedFiles: number;
};

export type BackupFinished = {
    filesCopied: number;
    filesTotal:number;
    profileName: string;
};


export type DetailFromFolders = {
  filesCount:number;
  foldersSize:number;
}

export type BackupHistory = {
  id: string,
  date_start: string,
  date_end:string,
  files_copied?:number,
  files_skipped?:number,
  files_total?:number,
  folder_size?:number,
  duration:number,
  profile:Profile
}

export type AppError = {
  type: 'databaseError' | 'filesError';
  message:string;
}