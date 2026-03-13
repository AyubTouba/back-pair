import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Layers, Copy, SkipForward, Files, Terminal } from 'lucide-react'
import React, { useContext, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core'
import { AppError, BackupFinished, BackupProgress, DetailFromFolders, Profile } from '@/types/types'
import { listen } from '@tauri-apps/api/event';
import { getFriendlyErrorMessage, getPercentage } from '@/utils/helper'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { ProfileContext } from '@/contexts/ProfilesContext'
import { BackupContext } from '@/contexts/BackupContext'
import { CurrentTabContext } from '@/contexts/CurrentTabContext'
import { PageHeader } from "@/components/PageHeader"
import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants, fadeIn } from '@/lib/animations'




export default function Backup() {
    const { profiles, setProfiles } = useContext(ProfileContext);
    const { currentTab } = useContext(CurrentTabContext);
    const { isBackupRunning, setIsBackupRunning } = useContext(BackupContext);
    const [selectedProfile, setSelectedProfile] = React.useState<string>("");
    const [logs, setLogs] = React.useState<string[]>([]);
    const [totalFiles, setTotalFiles] = React.useState<number>(0);
    const [filesCopied, setFilesCopied] = React.useState<number>(0);
    const [filesSkipped, setFilesSkipped] = React.useState<number>(0);
    const [progress, setProgress] = React.useState<number>(0);

    useEffect(() => {
        if (profiles.length == 0) {
            invoke<Profile[]>("list_profiles").then((data) => {
                setProfiles(data);
            })
        }

        let unlistenBackupStart: (() => void) | undefined;
        let unlistenBackupFiles: (() => void) | undefined;
        let unlistenBackupFinished: (() => void) | undefined;
        let unlistenBackupErrors: (() => void) | undefined;
        const setupListeners = async () => {
            unlistenBackupStart = await listen<string>('backup_start', (even) => {
                setLogs((prev) => [
                    even.payload,
                    ...prev
                ]);
            });

            unlistenBackupFiles = await listen<BackupProgress>('backup_files', (event) => {

                if (event.payload.copiedFiles != filesCopied) {
                    setLogs((prev) => [
                        `${event.payload.copiedFiles} of ${event.payload.totalFiles} files copied`,
                        ...prev
                    ]);
                }
                if (event.payload.skippedFiles != filesSkipped) {
                    setLogs((prev) => [
                        `${event.payload.skippedFiles} of ${event.payload.totalFiles} files skipped (exist)`,
                        ...prev
                    ]);
                }

                setProgress(getPercentage(event.payload.copiedFiles, event.payload.totalFiles));
                setFilesCopied(event.payload.copiedFiles);
                setFilesSkipped(event.payload.skippedFiles);
            });

            unlistenBackupFinished = await listen<BackupFinished>('backup_finished', (event) => {
                resetBackup();
                setLogs((prev) => [`Backup completed for profile: ${event.payload.profileName}.`, ...prev]);
                toast.success("Backup Finished", {
                    description: "The backup finished successfully.",
                });
            });

            unlistenBackupErrors = await listen<string>('backup_error', (event) => {
                resetBackup();
                setLogs((prev) => [`Backup failed to start. See error details below.`, ...prev]);
                toast.error("Backup Error", {
                    description: event.payload,
                });
            });
        };

        setupListeners();

        if (currentTab.params) {
            handleBackup((currentTab.params.profile as Profile).id);
        }

        return () => {
            if (unlistenBackupStart) unlistenBackupStart();
            if (unlistenBackupFiles) unlistenBackupFiles();
            if (unlistenBackupFinished) unlistenBackupFinished();
            if (unlistenBackupErrors) unlistenBackupErrors();
        };
    }, [])

    const resetBackup = () => {
        setIsBackupRunning(false);
        setProgress(0);
        setFilesCopied(0);
        setFilesSkipped(0)
        setTotalFiles(0);
    }

    const handleBackup = (profileid: null | string = null) => {
        let profileId = profileid ? profileid : selectedProfile;
        if (!profileId) {
            setLogs((prev) => ["Please select a profile first", ...prev])
            return
        }
        const profile = profiles.find(pr => pr.id === profileId);
        setLogs([]);
        setIsBackupRunning(true);

        invoke<DetailFromFolders>("run_backup", { profile }).then((data) => {
            setTotalFiles(data.filesCount);
            setLogs((prev) => [`Starting backup for profile: ${profile?.name_profile}...`, ...prev])
        }).catch((err: AppError) => {
            resetBackup();
            toast.error("Backup Error", {
                description: getFriendlyErrorMessage(err),
            });
        })

    }


    return (
        <motion.div
            className="flex flex-col h-full p-6 gap-6"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            <PageHeader title="Backup Center" subtitle="Run and monitor folder backups" />

            <Card className="flex-1 flex flex-col overflow-hidden">
                <CardHeader>
                    <CardTitle>Run Backup</CardTitle>
                    <CardDescription>Select a profile and start the backup process</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 flex-1 overflow-hidden">
                    <div className="bg-muted/30 rounded-xl p-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2 text-muted-foreground mr-2">
                            <Layers className="h-5 w-5 hidden sm:block" />
                        </div>
                        <div className="flex-1">
                            <Select value={selectedProfile} onValueChange={setSelectedProfile} disabled={isBackupRunning}>
                                <SelectTrigger className="w-full bg-background">
                                    <SelectValue placeholder="Select a profile" />
                                </SelectTrigger>
                                <SelectContent>
                                    {profiles.map((profile: Profile) => <SelectItem key={profile.id} value={profile.id}>{profile.name_profile}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className="mt-2 sm:mt-0 gap-2 min-w-[150px]"
                            onClick={() => handleBackup()}
                            disabled={isBackupRunning || !selectedProfile}
                        >
                            {isBackupRunning ? (
                                <>
                                    <span className="relative flex h-2 w-2 mr-1">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                                    </span>
                                    Backing up...
                                </>
                            ) : (
                                <>
                                    <Play className="h-4 w-4" />
                                    Launch Backup
                                </>
                            )}
                        </Button>
                    </div>

                    <AnimatePresence>
                        {(isBackupRunning && totalFiles != 0) && (
                            <motion.div
                                variants={fadeIn}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-4"
                            >
                                <div className="space-y-3">
                                    <Progress value={progress} className="h-2" />
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-xs bg-muted/50 px-2.5 py-1.5 rounded-md border text-muted-foreground">
                                                <Copy className="h-3.5 w-3.5 text-blue-500" />
                                                <span><strong className="text-foreground font-semibold">{filesCopied}</strong> copied</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs bg-muted/50 px-2.5 py-1.5 rounded-md border text-muted-foreground">
                                                <SkipForward className="h-3.5 w-3.5 text-orange-500" />
                                                <span><strong className="text-foreground font-semibold">{filesSkipped}</strong> skipped</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs bg-muted/50 px-2.5 py-1.5 rounded-md border text-muted-foreground">
                                                <Files className="h-3.5 w-3.5 text-zinc-500" />
                                                <span><strong className="text-foreground font-semibold">{totalFiles}</strong> total</span>
                                            </div>
                                        </div>
                                        <span className="text-sm font-medium text-muted-foreground">{progress}%</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex flex-col flex-1 min-h-[250px] bg-zinc-950 rounded-xl overflow-hidden border">
                        <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-900 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-inner" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 shadow-inner" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-inner" />
                                </div>
                                <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">Output</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className={`h-2.5 w-2.5 rounded-full shadow-inner ${isBackupRunning ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`} />
                            </div>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="font-mono text-xs leading-relaxed text-zinc-300">
                                {logs.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        {logs.map((log, index) => (
                                            <div key={index} className="flex gap-3 hover:bg-zinc-900/50 px-2 py-0.5 rounded transition-colors group">
                                                <span className="text-zinc-600 select-none flex-shrink-0">&gt;</span>
                                                <span className="text-zinc-500 flex-shrink-0">[{new Date().toLocaleTimeString()}]</span>
                                                <span className="break-all text-zinc-300">{log}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-3 py-16">
                                        <Terminal className="h-8 w-8 text-zinc-600" strokeWidth={1.5} />
                                        <p>Awaiting backup...</p>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </CardContent>
                {/* TODO  <CardFooter className="text-xs text-muted-foreground">Last backup: Never</CardFooter> */}
            </Card>
        </motion.div>
    )
}