import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface ViewDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  data: any
}

export default function ViewDetailsModal({ isOpen, onClose, data }: ViewDetailsModalProps) {
  if (!data) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">Details</DialogTitle>
          <DialogDescription>
            Full information for the selected item.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 items-center gap-4">
              <span className="font-medium text-secondary-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
              <span className="text-muted-foreground">{String(value)}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

