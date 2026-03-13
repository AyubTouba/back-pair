import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AppError, FolderPair, Profile } from "@/types/types"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { ArrowDown, Folder, FolderInput, FolderOutput, Plus, Save, Tag, X } from "lucide-react"
import { useContext, useEffect, useState } from "react";
import { open } from '@tauri-apps/plugin-dialog';
import { toast } from "sonner"
import { invoke } from "@tauri-apps/api/core";
import { CurrentTabContext } from "@/contexts/CurrentTabContext"
import { TABS } from "@/types/enums"
import { getFriendlyErrorMessage } from "@/utils/helper"
import { ProfileContext } from "@/contexts/ProfilesContext"
import { PageHeader } from "@/components/PageHeader"
import { AnimatePresence, motion } from "framer-motion"
import { cardVariants } from "@/lib/animations"

export default function AddProfile() {
    const { currentTab, setCurrentTab } = useContext(CurrentTabContext);
    const [isAddOperation, setIsAddOperation] = useState<boolean>(true);
    const [profileName, setProfileName] = useState<string>("");
    const [folderPairs, setFolderPairs] = useState<FolderPair[]>([{ id: crypto.randomUUID(), from_folder: "", to_folder: "" }]);
    const { setProfiles } = useContext(ProfileContext);

    useEffect(() => {
        if (currentTab.params) {
            setProfileName((currentTab.params.profile as Profile).name_profile);
            setFolderPairs((currentTab.params.profile as Profile).pairfolders);
            setIsAddOperation(false);
        }
    }, []);

    const addFolderPair = () => {
        setFolderPairs([...folderPairs, { id: crypto.randomUUID(), from_folder: "", to_folder: "" }])
    }

    const removeFolderPair = (id: string) => {
        if (folderPairs.length > 1) {
            setFolderPairs(folderPairs.filter((pair) => pair.id !== id))
        } else {
            toast.error("Cannot remove", {
                description: "You need at least one folder pair",
            })
        }
    }

    const updateFolderPair = (id: string, field: "from_folder" | "to_folder", value: string) => {
        setFolderPairs(folderPairs.map((pair) => (pair.id === id ? { ...pair, [field]: value } : pair)))
    }

    const selectFolder = async (id: string, field: "from_folder" | "to_folder") => {
        const folderPath = await open({
            multiple: false,
            directory: true,
        });
        if (folderPath != null) {
            updateFolderPair(id, field, folderPath)
        } else {
            toast.error("Choose a folder", { description: "Please a valid directory" })
        }
    }

    const saveProfile = async () => {
        if (!profileName.trim()) {
            toast.error("Profile name required", {
                description: "Please enter a name for this profile",
            })
            return
        }

        const invalidPairs = folderPairs.filter((pair) => !pair.from_folder || !pair.to_folder)
        if (invalidPairs.length > 0) {
            toast.error("Incomplete folder pairs", {
                description: "Please select both source and destination folders for all pairs",
            })
            return;
        }
        const payload = { profile: { name_profile: profileName, id: isAddOperation ? crypto.randomUUID() : (currentTab.params.profile as Profile).id }, pairFolders: folderPairs };

        if (isAddOperation) {
            invoke("add_profile", { ...payload }).then(() => {
                invoke<Profile[]>("list_profiles").then((data) => {
                    setProfiles(data);
                })
                toast.success("Profile saved", {
                    description: `Profile "${profileName}" has been created with ${folderPairs.length} folder pairs`,
                })

                setCurrentTab({ tab: TABS.RUNBACKUP });
            }).catch((err: AppError) => {
                console.log(err);
                toast.error("Error", {
                    description: `${getFriendlyErrorMessage(err)}`,
                })
            })
        } else {
            invoke("edit_profile", { ...payload }).then(() => {

                invoke<Profile[]>("list_profiles").then((data) => {
                    setProfiles(data);
                })

                toast.success("Profile saved", {
                    description: `Profile "${profileName}" has been edited with ${folderPairs.length} folder pairs`,
                })

                setCurrentTab({ tab: TABS.RUNBACKUP });
            })
        }

    }

    return (
        <div className="flex flex-col h-full p-6 gap-6">
            <PageHeader
                title={isAddOperation ? 'Add Profile' : 'Edit Profile'}
                subtitle="Define folder pairs for your backup configuration"
            />

            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>{isAddOperation ? 'Create New Profile' : 'Edit Profile Configuration'}</CardTitle>
                    <CardDescription>Define a profile with a name and the folders you want to back up</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <ScrollArea className="pr-4">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="profile-name" className="text-sm font-medium">
                                    Profile Name
                                </label>
                                <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="profile-name"
                                        placeholder="e.g., Work Documents, Personal Photos"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium">Folder Pairs</h3>
                                </div>

                                <div className="space-y-4">
                                    <AnimatePresence initial={false}>
                                        {folderPairs.map((pair, index) => (
                                            <motion.div
                                                key={pair.id}
                                                variants={cardVariants}
                                                initial="initial"
                                                animate="animate"
                                                exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeInOut" } }}
                                            >
                                                <Card className="relative">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                        onClick={() => removeFolderPair(pair.id)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                        <span className="sr-only">Remove</span>
                                                    </Button>
                                                    <CardContent className="p-4 grid gap-4">
                                                        <div className="flex items-center gap-2">
                                                            <div className="bg-primary/10 text-primary text-xs font-semibold h-6 w-6 rounded-full flex items-center justify-center">
                                                                {index + 1}
                                                            </div>
                                                            <p className="text-sm font-medium">Folder Pair {index + 1}</p>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium flex items-center gap-1">
                                                                <FolderInput className="h-4 w-4" />
                                                                Source Folder
                                                            </label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    placeholder="Select source folder"
                                                                    value={pair.from_folder}
                                                                    className="flex-1 font-mono text-xs bg-muted/20"
                                                                    title={pair.from_folder}
                                                                    readOnly
                                                                />
                                                                <Button variant="secondary" size="icon" onClick={() => selectFolder(pair.id, "from_folder")}>
                                                                    <Folder className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                        <div className="flex justify-center">
                                                            <ArrowDown className="h-4 w-4 text-primary/40" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-sm font-medium flex items-center gap-1">
                                                                <FolderOutput className="h-4 w-4" />
                                                                Destination Folder
                                                            </label>
                                                            <div className="flex gap-2">
                                                                <Input
                                                                    placeholder="Select destination folder"
                                                                    value={pair.to_folder}
                                                                    className="flex-1 font-mono text-xs bg-muted/20"
                                                                    title={pair.to_folder}
                                                                    readOnly
                                                                />
                                                                <Button variant="secondary" size="icon" onClick={() => selectFolder(pair.id, "to_folder")}>
                                                                    <Folder className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    <div
                                        className="border-2 border-dashed border-muted-foreground/25 rounded-xl p-4 flex items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
                                        onClick={addFolderPair}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" || e.key === " ") {
                                                e.preventDefault();
                                                addFolderPair();
                                            }
                                        }}
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="text-sm font-medium">Add Folder Pair</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t p-4">
                    <Button variant="outline" onClick={() => setCurrentTab({ tab: TABS.PROFILES })}>
                        Cancel
                    </Button>
                    <Button onClick={saveProfile}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
