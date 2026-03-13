import { MoreHorizontal, Play, Edit, Trash2, FolderInput, FolderOutput, ChevronUp, ChevronDown, CalendarDays, ArrowDown } from "lucide-react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Profile } from "@/types/types"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"

interface ProfileCardProps {
    profile: Profile,
    onDelete: (id: string) => void
    onRunBackup: (id: string) => void
    onEdit: (profile: Profile) => void
}

export function ProfileCard({ profile, onDelete, onRunBackup, onEdit }: ProfileCardProps) {
    const [showFolders, setShowFolders] = useState(false)

    return (
        <Card className="overflow-hidden p-0 hover:shadow-md hover:border-primary/20 transition-all duration-200 border-l-3 border-l-primary">
            <CardHeader className="bg-muted/30 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold truncate flex gap-2 items-center">
                        <span className="truncate">{profile.name_profile}</span>
                        <span className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-medium whitespace-nowrap">
                            {profile.pairfolders.length} {profile.pairfolders.length === 1 ? "pair" : "pairs"}
                        </span>
                    </CardTitle>
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
                <CardDescription className="flex items-center gap-1.5 mt-1.5">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>Created: {profile.created_at.split("T")[0]}</span>
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

                    <AnimatePresence initial={false} mode="wait">
                        {showFolders ? (
                            <motion.div
                                key="expanded"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="space-y-2 overflow-hidden"
                            >
                                {profile.pairfolders.map((pair) => (
                                    <div key={pair.id} className="space-y-1 text-sm pt-1">
                                        <div className="flex items-center gap-1.5">
                                            <FolderInput className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                                            <span className="truncate text-xs">{pair.from_folder}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 pl-[7px]">
                                            <ArrowDown className="h-3 w-3 text-primary/50" />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FolderOutput className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                                            <span className="truncate text-xs">{pair.to_folder}</span>
                                        </div>
                                        {pair.id !== profile.pairfolders[profile.pairfolders.length - 1].id && <Separator className="my-3" />}
                                    </div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="collapsed"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="text-sm text-muted-foreground"
                            >
                                {profile.pairfolders.map((pair, index) => (
                                    <span key={pair.id}>
                                        {index > 0 && ", "}
                                        {pair.from_folder.split("/").pop()}
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2 border-t p-3 bg-muted/30">
                <Button onClick={() => onEdit(profile)} variant="outline" size="sm" className="flex-1 hover:scale-[1.01] transition-transform">
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                </Button>
                <Button size="sm" onClick={() => onRunBackup(profile.id)} className="flex-1 hover:scale-[1.01] transition-transform shadow-sm">
                    <Play className="h-3.5 w-3.5 mr-1.5" fill="currentColor" />
                    Run Backup
                </Button>
            </CardFooter>
        </Card>
    )
}
