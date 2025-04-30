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
