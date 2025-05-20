import { useEffect, useState } from "react";
import { check, Update } from '@tauri-apps/plugin-updater';
import { relaunch } from '@tauri-apps/plugin-process';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { CheckCircle2, Download } from "lucide-react";
import { Progress } from "./ui/progress";
import { Button } from "./ui/button";

export function CheckUpdater() {
    const [update, setUpdate] = useState<Update>();
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateProgress, setUpdateProgress] = useState(0);
    const [updateComplete, setUpdateComplete] = useState(false);

    useEffect(() => {
        check().then(() => {
            if (update) {
                setShowUpdateDialog(true);
                setUpdate(update);
            }
        }).catch((e) => console.log("err", e))

    }, []);

    const startUpdate = async () => {
        if (!update) return;
        setIsUpdating(true);
        let downloaded = 0;
        await update.downloadAndInstall((event) => {
            switch (event.event) {

                case 'Progress':
                    downloaded += event.data.chunkLength;
                    setUpdateProgress(downloaded);
                    break;
                case 'Finished':
                    setUpdateComplete(true)
                    break;
            }
        });

        let progress = 0;
        const updateInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 8) + 3 // Random progress between 3-10%
            if (progress >= 100) {
                progress = 100
                clearInterval(updateInterval)
                setTimeout(() => {
                    setUpdateComplete(true)
                }, 500)
            }
            setUpdateProgress(progress)
        }, 300);
        console.log('update installed');

    }

    const restartApp = async () => {
        console.log("relaunch")
        await relaunch();
    }

    return <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    New version Available
                </DialogTitle>
                <DialogDescription>
                    {(!isUpdating && !updateComplete) && (
                        <span>A new version of BackPair (v1.1.0) is available.</span>
                    )}

                </DialogDescription>
            </DialogHeader>
            {isUpdating && !updateComplete && (
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3 mb-2">
                        <p className="text-sm text-muted-foreground">Please don't close the application.</p>
                    </div>
                    <Progress value={updateProgress} className="h-2" />
                    <p className="text-sm text-center text-muted-foreground">{updateProgress}% complete</p>
                </div>
            )}

            {updateComplete && (
                <div className="space-y-4 py-4">
                    <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <div>
                            <h4 className="font-medium">Update Complete!</h4>
                            <p className="text-sm text-muted-foreground">
                                BackupGuard has been successfully updated to version 1.1.0.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <DialogFooter className="flex sm:justify-between">
                {!isUpdating && !updateComplete && (
                    <>
                        <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                            Not Now
                        </Button>
                        <Button onClick={startUpdate}>
                            <Download className="h-4 w-4 mr-2" />
                            Update Now
                        </Button>
                    </>
                )}

                {isUpdating && !updateComplete && (
                    <Button variant="outline" disabled className="ml-auto">
                        Installing...
                    </Button>
                )}

                {updateComplete && (
                    <Button onClick={restartApp} className="ml-auto">
                        Restart
                    </Button>
                )}
            </DialogFooter>
        </DialogContent>
    </Dialog>;
}