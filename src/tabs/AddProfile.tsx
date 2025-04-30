import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FolderPair } from "@/types/types"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { Folder, FolderInput, FolderOutput, Plus, Save, X } from "lucide-react"
import { useState } from "react";
import { open } from '@tauri-apps/plugin-dialog';
import { toast } from "sonner"
import { invoke } from "@tauri-apps/api/core";

export default function AddProfile() {
    const [profileName, setProfileName] = useState("")
    const [folderPairs, setFolderPairs] = useState<FolderPair[]>([{ id: crypto.randomUUID(), from_folder: "", to_folder: "" }])

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
        const payload = { profile: { name_profile: profileName, id: crypto.randomUUID() }, pairFolders: folderPairs };

        invoke("add_profile", { ...payload }).then((data: any) => {
            console.log(data, "result");

            toast.success("Profile saved", {
                description: `Profile "${profileName}" has been created with ${folderPairs.length} folder pairs`,
            })
        })



    }

    return (
        <div className="flex flex-col h-full p-6 gap-6">
            <header className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Add Profile</h1>
            </header>

            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Create Backup Profile</CardTitle>
                    <CardDescription>Define a profile with a name and the folders you want to back up</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <ScrollArea className="pr-4">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="profile-name" className="text-sm font-medium">
                                    Profile Name
                                </label>
                                <Input
                                    id="profile-name"
                                    placeholder="e.g., Work Documents, Personal Photos"
                                    value={profileName}
                                    onChange={(e) => setProfileName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-medium">Folder Pairs</h3>
                                    <Button variant="outline" size="sm" onClick={addFolderPair}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Folder Pair
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {folderPairs.map((pair) => (
                                        <Card key={pair.id} className="relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-2 top-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                                                onClick={() => removeFolderPair(pair.id)}
                                            >
                                                <X className="h-4 w-4" />
                                                <span className="sr-only">Remove</span>
                                            </Button>
                                            <CardContent className="p-4 grid gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium flex items-center gap-1">
                                                        <FolderInput className="h-4 w-4" />
                                                        Source Folder
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <Input
                                                            placeholder="Select source folder"
                                                            value={pair.from_folder}
                                                            onChange={(e) => updateFolderPair(pair.id, "from_folder", e.target.value)}
                                                            className="flex-1"
                                                        />
                                                        <Button variant="secondary" size="icon" onClick={() => selectFolder(pair.id, "from_folder")}>
                                                            <Folder className="h-4 w-4" />
                                                        </Button>
                                                    </div>
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
                                                            onChange={(e) => updateFolderPair(pair.id, "to_folder", e.target.value)}
                                                            className="flex-1"
                                                        />
                                                        <Button variant="secondary" size="icon" onClick={() => selectFolder(pair.id, "to_folder")}>
                                                            <Folder className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t p-4">
                    <Button variant="outline" >
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
