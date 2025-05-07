
import { Check,FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { BackupHistory } from "@/types/types"
import { formatDate, formatDuration } from "@/utils/helper"

export default function History() {

    const [history,setHistory] = useState<BackupHistory[]>([]);

    useEffect(() => {
        invoke("history_backup").then((data) => {
            console.log(data)
            setHistory(data as BackupHistory[]) ;
        })
    }, [])

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
                          <Card key={backup.id}>
                              <CardHeader className="p-4 flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full text-green-500 bg-green-500/10
                                      backup.status,
                                    )}`}
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
                                      {backup.files_copied} / {backup.files_total} files
                                    </div>
                                  {backup.folder_size &&   <div className="text-xs text-muted-foreground">{backup.folder_size.toFixed(2)} GB</div>}
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm font-medium">
                                      { formatDuration(backup.duration)}
                                    </div>
                                  </div>
                                </div>
                              </CardHeader>
                     
                          </Card>
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
