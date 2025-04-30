import { MoreHorizontal, Play, Link, Edit, Trash2, FolderInput, FolderOutput } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Profile } from "@/types/types"

interface ProfileCardProps {
    profile: Profile,
    onDelete: (id: string) => void
    onRunBackup: (id: string) => void
}

export function ProfileCard({ profile, onDelete, onRunBackup }: ProfileCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{profile.name_profile}</CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger >
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
                            <DropdownMenuItem >
                                <Link href={`/edit-profile/${profile.id}`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Link>
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
                    Created: {profile.created_at.split("T")[0]} •{profile.lastBackup ? ` Last backup: ${profile.lastBackup}` : " Never backed up"}
                </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    <h4 className="text-sm font-medium">Folder Mappings</h4>
                    <div className="space-y-2">
                        {profile.pairfolders.map((pair) => (
                            <div key={pair.id} className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 text-sm">
                                <div className="truncate rounded border bg-background px-2 py-1 flex items-center gap-1">
                                    <FolderInput className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                    <span className="truncate">{pair.from_folder}</span>
                                </div>
                                <div className="flex-shrink-0 text-muted-foreground">→</div>
                                <div className="truncate rounded border bg-background px-2 py-1 flex items-center gap-1">
                                    <FolderOutput className="h-3 w-3 flex-shrink-0 text-muted-foreground" />
                                    <span className="truncate">{pair.to_folder}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t p-3 bg-muted/30">
                <Button variant="outline" size="sm" >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                </Button>
                <Button size="sm" onClick={() => onRunBackup(profile.id)}>
                    <Play className="h-3 w-3 mr-1" />
                    Run Backup
                </Button>
            </CardFooter>
        </Card>
    )
}
