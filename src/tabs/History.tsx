
import {
  Check,
  ChevronRight,
  Clock,
  Copy,
  Files,
  HardDrive,
  SkipForward,
  Timer,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useContext, useEffect, useState } from "react"
import { invoke } from "@tauri-apps/api/core"
import { BackupHistory } from "@/types/types"
import { formatDate, formatDuration, octetsToReadableSize } from "@/utils/helper"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { PageHeader } from "@/components/PageHeader"
import { cardVariants, pageVariants, staggerContainer } from "@/lib/animations"
import { motion } from "framer-motion"
import { CurrentTabContext } from "@/contexts/CurrentTabContext"
import { TABS } from "@/types/enums"

export default function History() {
  const [history, setHistory] = useState<BackupHistory[]>([])
  const [expandedBackup, setExpandedBackup] = useState<string | null>(null)
  const { setCurrentTab } = useContext(CurrentTabContext)

  useEffect(() => {
    invoke<BackupHistory[]>("history_backup").then((data) => {
      setHistory(data)
    })
  }, [])

  const filesBackedUp = (backup: BackupHistory) => {
    return backup.files_copied + backup.files_skipped
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className="flex flex-col h-full p-6 gap-6"
    >
      <PageHeader
        title="Backup History"
        subtitle="View past backup executions and statistics"
      />

      <ScrollArea className="flex-1 overflow-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4 pr-1"
        >
          {history.length > 0 ? (
            history.map((backup) => (
              <motion.div key={backup.id} variants={cardVariants}>
                <Collapsible
                  open={expandedBackup === backup.id}
                  onOpenChange={(open) => setExpandedBackup(open ? backup.id : null)}
                >
                  <Card className="border-l-[3px] border-l-emerald-500 hover:shadow-sm transition-all duration-200">
                    <CollapsibleTrigger className="w-full text-left">
                      <CardHeader className="p-4 flex flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                            <Check className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="text-base truncate">{backup.profile.name_profile}</CardTitle>
                            <CardDescription>{formatDate(backup.date_start)}</CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {filesBackedUp(backup)} / {backup.files_total} files
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {octetsToReadableSize(backup.folder_size)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatDuration(backup.duration)}</div>
                            <div className="text-xs capitalize rounded-full px-2 py-0.5 inline-block text-emerald-600 bg-emerald-500/10">
                              success
                            </div>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedBackup === backup.id ? 90 : 0 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="text-muted-foreground"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </motion.div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="p-4 pt-4 border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                          <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <User className="h-3.5 w-3.5" />
                              <span>Profile</span>
                            </div>
                            <p className="text-sm font-medium truncate">{backup.profile.name_profile}</p>
                          </div>

                          <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Start Time</span>
                            </div>
                            <p className="text-sm font-medium">{formatDate(backup.date_start)}</p>
                          </div>

                          <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3.5 w-3.5" />
                              <span>End Time</span>
                            </div>
                            <p className="text-sm font-medium">{formatDate(backup.date_end)}</p>
                          </div>

                          <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Timer className="h-3.5 w-3.5" />
                              <span>Duration</span>
                            </div>
                            <p className="text-sm font-medium">{formatDuration(backup.duration)}</p>
                          </div>

                          <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Files className="h-3.5 w-3.5" />
                              <span>Files Processed</span>
                            </div>
                            <p className="text-sm font-medium">{backup.files_total}</p>
                          </div>

                          <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Copy className="h-3.5 w-3.5" />
                              <span>Files Backed Up</span>
                            </div>
                            <p className="text-sm font-medium">{backup.files_copied}</p>
                          </div>

                          <div className="rounded-lg bg-muted/30 p-3 space-y-1">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <SkipForward className="h-3.5 w-3.5" />
                              <span>Files Skipped</span>
                            </div>
                            <p className="text-sm font-medium">{backup.files_skipped}</p>
                          </div>

                          <div className="rounded-lg bg-muted/30 p-3 space-y-1 md:col-span-2 xl:col-span-3">
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <HardDrive className="h-3.5 w-3.5" />
                              <span>Total Size</span>
                            </div>
                            <p className="text-sm font-medium">{octetsToReadableSize(backup.folder_size)}</p>
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
                              className="h-2 bg-emerald-500/15 [&>div]:bg-emerald-500"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              </motion.div>
            ))
          ) : (
            <motion.div variants={cardVariants}>
              <Card className="flex flex-col items-center justify-center p-10 text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Clock className="h-12 w-12 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">No backups recorded yet</h3>
                <p className="mb-5 text-sm text-muted-foreground">Run your first backup to see results here</p>
                <Button onClick={() => setCurrentTab({ tab: TABS.RUNBACKUP })}>Run a Backup</Button>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </ScrollArea>
    </motion.div>
  )
}
