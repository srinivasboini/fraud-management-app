import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface InactivityWarningModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  warningSeconds: number
  onStayLoggedIn: () => void
  onLogout: () => void
}

export function InactivityWarningModal({
  isOpen,
  onOpenChange,
  warningSeconds,
  onStayLoggedIn,
  onLogout,
}: InactivityWarningModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Timeout Warning</AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in {warningSeconds} seconds due to inactivity.
            Would you like to stay logged in?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onLogout}>
            Logout
          </AlertDialogCancel>
          <AlertDialogAction onClick={onStayLoggedIn}>
            Stay Logged In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 