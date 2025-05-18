import { MoreHorizontal, Play, Edit, Trash2, FolderInput, FolderOutput, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Profile } from "@/types/types"
import { useState } from "react"
import { Separator } from "@radix-ui/react-separator"
interface ProfileCardProps {
    profile: Profile,
    onDelete: (id: string) => void
    onRunBackup: (id: string) => void
    onEdit: (profile: Profile) => void
}

export function ProfileCard({ profile, onDelete, onRunBackup, onEdit }: ProfileCardProps) {
    const [showFolders, setShowFolders] = useState(false)

    return (
        <Card className="overflow-hidden p-0">
            <CardHeader className="bg-muted/50 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{profile.name_profile}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onRunBackup(profile.id)}>
                                <Play className="h-4 w-4 mr-2" />
                                Run Backup
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(profile)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => onDelete(profile.id)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Profile
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <CardDescription>
                    Created: {profile.created_at.split("T")[0]}
                    {/* TODO •{profile.lastBackup ? ` Last backup: ${profile.lastBackup}` : " Never backed up"} */}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                            {profile.pairfolders.length} Folder {profile.pairfolders.length === 1 ? "Mapping" : "Mappings"}
                        </h4>
                        <Button variant="ghost" size="sm" onClick={() => setShowFolders(!showFolders)} className="h-7 px-2">
                            {showFolders ? "Hide" : "Show"} Details
                            {showFolders ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}
                        </Button>
                    </div>

                    {showFolders ? (
                        <div className="space-y-2">
                            {profile.pairfolders.map((pair) => (
                                <div key={pair.id} className="space-y-1 text-sm">
                                    <div className="flex items-center gap-1">
                                        <FolderInput className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                        <span className="truncate text-xs">{pair.from_folder}</span>
                                    </div>
                                    <div className="flex items-center gap-1 pl-4">
                                        <span className="text-xs text-muted-foreground">↓</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FolderOutput className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                        <span className="truncate text-xs">{pair.to_folder}</span>
                                    </div>
                                    {pair.id !== profile.pairfolders[profile.pairfolders.length - 1].id && <Separator className="my-2" />}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            {profile.pairfolders.map((pair, index) => (
                                <span key={pair.id}>
                                    {index > 0 && ", "}
                                    {pair.from_folder.split("/").pop()}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 border-t p-3 bg-muted/30">
                <Button onClick={() => onEdit(profile)} variant="outline" size="sm" className="flex-1">
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                </Button>
                <Button size="sm" onClick={() => onRunBackup(profile.id)} className="flex-1">
                    <Play className="h-3 w-3 mr-1" />
                    Run Backup
                </Button>
            </CardFooter>
        </Card>
    )
}
