import { ProfileCard } from '@/components/ProfileCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { FolderPlus, Plus } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { toast } from "sonner"
import { invoke } from "@tauri-apps/api/core";
import { Profile } from '@/types/types'
import { CurrentTabContext } from '@/contexts/CurrentTabContext'
import { TABS } from '@/types/enums'
import { ProfileContext } from '@/contexts/ProfilesContext'
import ConfirmDialog from '@/components/ConfirmDialog'
import { PageHeader } from "@/components/PageHeader"
import { motion } from 'framer-motion'
import { staggerContainer, cardVariants, fadeIn } from '@/lib/animations'


export default function Profiles() {
    const { setCurrentTab } = useContext(CurrentTabContext);
    const { profiles, setProfiles } = useContext(ProfileContext);
    const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
    const [toDelete, setTodelete] = useState<boolean>(false);
    const [profileIdToDelete, setProfileIdToDelete] = useState<string | null>(null);
    const deleteProfile = (id: string) => {
        setTimeout(() => {
            setProfileIdToDelete(id);
            setDeleteDialog(true);
        }, 0);
    }

    const toEditProfile = (profile: Profile) => {
        setCurrentTab({ tab: TABS.ADDBACKUPPROFILE, params: { profile: profile } })
    }


    const runBackup = (id: string) => {
        const profile = profiles.find((p) => p.id === id)
        if (profile) {
            setCurrentTab({ tab: TABS.RUNBACKUP, params: { profile: profile } })
        }
    }

    useEffect(() => {
        if (profiles.length == 0) {
            invoke<Profile[]>("list_profiles").then((data) => {
                setProfiles(data);
            })
        }
    }, [])

    useEffect(() => {
        if (toDelete && profileIdToDelete) {
            invoke("delete_profile", { profileId: profileIdToDelete }).then(() => {

                invoke<Profile[]>("list_profiles").then((data) => {
                    setProfiles(data);
                })
                toast.success("Profile deleted", {
                    description: "The profile has been removed",
                })

            }).catch((e) => toast.error("Profile deleted", {
                description: e,
            }))
            setProfileIdToDelete(null);
            setTodelete(false);
        }
    }, [toDelete])

    return (
        <div className="flex flex-col h-full p-6 gap-6">
            <PageHeader
                title="Profiles"
                subtitle="Manage your backup configurations"
                actions={
                    <Button onClick={() => setCurrentTab({ tab: TABS.ADDBACKUPPROFILE })} >
                        <Plus className="h-4 w-4 mr-2" />
                        New Profile
                    </Button>
                }
            />
            <ConfirmDialog title="Are are sure want to delete this profile"
                showDialog={deleteDialog} setDialog={setDeleteDialog}
                setResult={setTodelete} body={null} />
            <ScrollArea className="flex-1 pr-4">
                {profiles.length > 0 ? (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 gap-4 pb-6"
                    >
                        {profiles.map((profile) => (
                            <motion.div key={profile.id} variants={cardVariants}>
                                <ProfileCard
                                    profile={profile}
                                    onDelete={deleteProfile}
                                    onRunBackup={runBackup}
                                    onEdit={toEditProfile}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div variants={fadeIn} initial="hidden" animate="show" className="pb-6">
                        <Card className="flex flex-col items-center justify-center p-8 text-center border-dashed">
                            <div className="mb-4 rounded-full bg-primary/10 p-4">
                                <FolderPlus className="h-12 w-12 text-primary" />
                            </div>
                            <h3 className="mb-2 text-xl font-medium tracking-tight">No profiles yet</h3>
                            <p className="mb-6 text-sm text-muted-foreground max-w-sm">
                                Create your first backup profile to define which folders you'd like to keep synced and secure.
                            </p>
                            <Button size="lg" onClick={() => setCurrentTab({ tab: TABS.ADDBACKUPPROFILE })}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Profile
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </ScrollArea >
        </div >
    )
}
