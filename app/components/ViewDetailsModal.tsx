import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ViewDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

export function ViewDetailsModal({ isOpen, onClose, data }: ViewDetailsModalProps) {
  if (!data) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Details</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {Object.entries(data).map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 gap-4">
                <div className="font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="col-span-2">
                  {typeof value === 'string' && new Date(value).toString() !== 'Invalid Date'
                    ? new Date(value).toLocaleString()
                    : String(value)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

