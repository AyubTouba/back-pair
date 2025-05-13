import { ProfileCard } from '@/components/ProfileCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Folder, Plus } from 'lucide-react'
import { useContext, useEffect } from 'react'
import { toast } from "sonner"
import { invoke } from "@tauri-apps/api/core";
import { Profile } from '@/types/types'
import { CurrentTabContext } from '@/contexts/CurrentTabContext'
import { TABS } from '@/types/enums'
import { ProfileContext } from '@/contexts/ProfilesContext'


export default function Profiles() {
    const {setCurrentTab } = useContext(CurrentTabContext);
    const {profiles, setProfiles} = useContext(ProfileContext);
    

    const deleteProfile = (id: string) => {

        invoke("delete_profile",{profileId:id}).then((result:any) => {
            if(result){
                setProfiles(profiles.filter((profile) => profile.id !== id))
                toast.success("Profile deleted", {
                    description: "The profile has been removed",
                })
            }
        })
    
    }

    const toEditProfile = (profile:Profile) => {
        setCurrentTab({tab:TABS.ADDBACKUPPROFILE,params:{profile:profile}})
    }


    const runBackup = (id: string) => {
        const profile = profiles.find((p) => p.id === id)
        if (profile) {
            toast("Backup started", {
                description: `Running backup for "${profile.name_profile}"`,
            })
        }
    }

    useEffect(() => {
        if(profiles.length == 0) {
        invoke<Profile[]>("list_profiles").then((data) => {
            setProfiles(data);
        })
        }
    }, [])

    return (
        <div className="flex flex-col h-full p-6 gap-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Profiles</h1>
                </div>
                <Button onClick={() => setCurrentTab({tab:TABS.ADDBACKUPPROFILE})} >
                    <Plus className="h-4 w-4 mr-2" />
                    New Profile
                </Button>
            </header>

            <ScrollArea className="flex-1 pr-4">
                <div className="grid gap-6 pb-6">
                    {profiles.length > 0 ? (
                        profiles.map((profile) => (
                            <ProfileCard
                                key={profile.id}
                                profile={profile}
                                onDelete={deleteProfile}
                                onRunBackup={runBackup}
                                onEdit={toEditProfile}
                            />
                        ))
                    ) : (
                        <Card className="flex flex-col items-center justify-center p-6 text-center">
                            <div className="mb-4 rounded-full bg-muted p-3">
                                <Folder className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <h3 className="mb-2 text-lg font-medium">No profiles yet</h3>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Create your first backup profile to get started
                            </p>
                            <Button onClick={() => setCurrentTab({tab:TABS.ADDBACKUPPROFILE})}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Profile
                            </Button>
                        </Card>
                    )}
                </div>
            </ScrollArea >
        </div >
    )
}
