"use client"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger, AlertDialogTitle, AlertDialogAction } from '@/components/ui/alert-dialog'
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog'
import { ReactNode } from 'react'

interface ConfirmModalProps {
    children: ReactNode,
    onConfirm: () => void
}

const ConfirmModal = ({ children, onConfirm }: ConfirmModalProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you sure ?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This Cannot be Undone
                    </AlertDialogDescription>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={onConfirm} >
                            Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ConfirmModal