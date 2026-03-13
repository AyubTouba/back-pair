import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'

interface ConfirmDialogProps {
    title: string,
    body?: string | null,
    yesLabel?: string,
    noLabel?: string
    showDialog: boolean
    setDialog: (status: boolean) => void
    setResult: (result: boolean) => void
}


function ConfirmDialog({ title, body, yesLabel = "Yes", noLabel = "No", setDialog, showDialog, setResult }: ConfirmDialogProps) {
    return <Dialog open={showDialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <div className="rounded-full bg-destructive/10 p-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                    </div>
                    {title}
                </DialogTitle>
                <DialogDescription>
                    {body}
                </DialogDescription>
            </DialogHeader>



            <DialogFooter className="flex gap-2 sm:justify-end">
                <Button variant="outline" onClick={() => { setResult(false); setDialog(false); }}>
                    {noLabel}
                </Button>
                <Button variant="destructive" onClick={() => { setResult(true); setDialog(false); }}>
                    {yesLabel}
                </Button>

            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default ConfirmDialog