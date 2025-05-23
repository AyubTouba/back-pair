import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { MessageCircleWarning } from 'lucide-react'
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


function ConfirmDialog({ title, body, yesLabel = "yes", noLabel = "no", setDialog, showDialog, setResult }: ConfirmDialogProps) {
    return <Dialog open={showDialog} onOpenChange={setDialog}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <MessageCircleWarning className="h-5 w-5 text-primary" />
                    {title}
                </DialogTitle>
                <DialogDescription>
                    {body}
                </DialogDescription>
            </DialogHeader>



            <DialogFooter className="flex sm:justify-between">

                <Button variant="outline" onClick={() => { setResult(true); setDialog(false); }}>
                    {yesLabel}
                </Button>
                <Button onClick={() => { setResult(false); setDialog(false); }}>
                    {noLabel}
                </Button>

            </DialogFooter>
        </DialogContent>
    </Dialog>
}

export default ConfirmDialog