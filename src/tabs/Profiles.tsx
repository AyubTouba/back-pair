import { ProfileCard } from '@/components/ProfileCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Folder, Plus } from 'lucide-react'
import React, { useEffect } from 'react'
import { toast } from "sonner"
import { invoke } from "@tauri-apps/api/core";
import { Profile } from '@/types/types'

// Sample data for profiles

export default function Profiles() {
    const [profiles, setProfiles] = React.useState<Profile[] | []>([])

    const deleteProfile = (id: string) => {
        setProfiles(profiles.filter((profile) => profile.id !== id))
        toast("Profile deleted", {
            description: "The profile has been removed",
        })
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
        invoke("list_profiles").then((data) => {
            console.log(data, "result");
            setProfiles(data as Profile[]);
        })
    }, [])

    return (
        <div className="flex flex-col h-full p-6 gap-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Profiles</h1>
                </div>
                <Button >
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
                            <Button >
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
