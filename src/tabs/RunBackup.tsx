import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, FileText } from 'lucide-react'
import React, { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core'
import { Profile } from '@/types/types'




export default function RunBackup() {

    const [selectedProfile, setSelectedProfile] = React.useState<string>("")
    const [logs, setLogs] = React.useState<string[]>([])
    const [isBackupRunning, setIsBackupRunning] = React.useState(false)
    const [profiles, setProfiles] = React.useState<Profile[] | []>([])


    useEffect(() => {
        invoke("list_profiles").then((data) => {
            setProfiles(data as Profile[]);
        })
    }, [])

    const handleBackup = () => {
        if (!selectedProfile) {
            setLogs((prev) => ["Please select a profile first", ...prev])
            return
        }

        setIsBackupRunning(true)
        setLogs((prev) => [`Starting backup for profile: ${selectedProfile}...`, ...prev])

        // Simulate backup process
        const files = ["Documents/work", "Pictures/vacation", "Desktop/projects", "Downloads/important"]
        let fileIndex = 0

        const interval = setInterval(() => {
            if (fileIndex < files.length) {
                setLogs((prev) => [`Copying ${files[fileIndex]}...`, ...prev])
                fileIndex++
            } else {
                clearInterval(interval)
                setLogs((prev) => ["Backup completed successfully!", ...prev])
                setIsBackupRunning(false)
            }
        }, 1500)
    }


    return (
        <div className="flex flex-col h-full p-6 gap-6">
            <header className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Backup Center</h1>
            </header>

            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Run Backup</CardTitle>
                    <CardDescription>Select a profile and start the backup process</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <Select value={selectedProfile} onValueChange={setSelectedProfile}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a profile" />
                                </SelectTrigger>
                                <SelectContent>
                                    {profiles.map((profile: Profile) => <SelectItem key={profile.id} value={profile.id}>{profile.name_profile}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className="mt-2 sm:mt-0 gap-2"
                            onClick={handleBackup}
                            disabled={isBackupRunning || !selectedProfile}
                        >
                            <Play className="h-4 w-4" />
                            {isBackupRunning ? "Backing up..." : "Launch Backup"}
                        </Button>
                    </div>

                    <div className="flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4" />
                            <h3 className="font-medium">Backup Logs</h3>
                        </div>
                        <Card className="flex-1">
                            <ScrollArea>
                                <div className="p-4 font-mono text-sm">
                                    {logs.length > 0 ? (
                                        logs.map((log, index) => (
                                            <div key={index} className="py-1 border-b border-border last:border-0">
                                                <span className="text-muted-foreground">[{new Date().toLocaleTimeString()}]</span> {log}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted-foreground italic">
                                            No logs yet. Start a backup to see activity here.
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                        </Card>
                    </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground">Last backup: Never</CardFooter>
            </Card>
        </div>
    )
}
//className={`${logs.length > 0 ? 'h-[calc(100vh-350px)] w-full rounded-md border' : ''}`}