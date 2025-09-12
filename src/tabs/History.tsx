
import { Check, ChevronDown, ChevronRight,FileText} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { BackupHistory } from "@/types/types"
import { formatDate, formatDuration, octetsToReadableSize } from "@/utils/helper"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"

export default function History() {

  const [history, setHistory] = useState<BackupHistory[]>([]);
  const [expandedBackup, setExpandedBackup] = useState<string | null>(null)
  useEffect(() => {
    invoke<BackupHistory[]>("history_backup").then((data) => {
      setHistory(data);
    })
  }, [])

  const filesBackedUp = (backup: BackupHistory) => {
    return backup.files_copied + backup.files_skipped
  } 
  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Backup History</h1>
        </div>

      </header>

      <ScrollArea className="h-[calc(100vh-132px)]">
        <div className="p-4 space-y-4">
          {history.length > 0 ? (
            history.map((backup) => (
              <Collapsible
                key={backup.id}
                open={expandedBackup === backup.id}
                onOpenChange={(open) => setExpandedBackup(open ? backup.id : null)}
              >
                <Card>
                  <CollapsibleTrigger className="w-full text-left">
                    <CardHeader className="p-4 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-blue-500 bg-blue-500/10`}
                        >
                       <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{backup.profile.name_profile}</CardTitle>
                          <CardDescription>{formatDate(backup.date_start)}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {filesBackedUp(backup)} / {backup.files_total} files
                          </div>
                          <div className="text-xs text-muted-foreground">{octetsToReadableSize(backup.folder_size)}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {formatDuration(backup.duration)}
                          </div>
                          <div
                            className={`text-xs capitalize rounded-full px-2 py-0.5 inline-block text-blue-500 bg-blue-500/10
                            `}
                          >
                            success
                          </div>
                        </div>
                        {expandedBackup === backup.id ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-4 pt-0 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2 mt-4">
                          <h4 className="text-sm font-medium">Backup Information</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">Profile:</div>
                            <div>{backup.profile.name_profile}</div>
                            <div className="text-muted-foreground">Start Time:</div>
                            <div>{formatDate(backup.date_start)}</div>
                            <div className="text-muted-foreground">End Time:</div>
                            <div>{formatDate(backup.date_end)}</div>
                            <div className="text-muted-foreground">Duration:</div>
                            <div>{formatDuration(backup.duration)}</div>
                          </div>
                        </div>
                        <div className="space-y-2 mt-4">
                          <h4 className="text-sm font-medium">Statistics</h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-muted-foreground">Files Processed:</div>
                            <div>{backup.files_total}</div>
                            <div className="text-muted-foreground">Files Backed Up:</div>
                            <div>{backup.files_copied}</div>
                            <div className="text-muted-foreground">Files Skipped (exist):</div>
                            <div>{backup.files_skipped}</div>
                            <div className="text-muted-foreground">Total Size:</div>
                            <div>{octetsToReadableSize(backup.folder_size)}</div>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2 mt-4">
                        <h4 className="text-sm font-medium">Backup Progress</h4>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Files</span>
                            <span>
                              {filesBackedUp(backup)} / {backup.files_total}
                            </span>
                          </div>
                          <Progress
                            value={(filesBackedUp(backup) / backup.files_total) * 100}
                            className="h-2"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))
          ) : (
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <div className="mb-4 rounded-full bg-muted p-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No backup history found</h3>
              <Button>Run a Backup</Button>
            </Card>
          )}
        </div>
      </ScrollArea>


    </div>
  )
}
