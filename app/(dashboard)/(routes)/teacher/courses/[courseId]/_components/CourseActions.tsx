"use client"
import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import { useConfettiStore } from '@/hooks/useConfettiStore'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface CourseActionsProps {
    disabled: boolean
    courseId: string
    isPublished: boolean
}

const CourseActions = ({ courseId, disabled, isPublished }: CourseActionsProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const confetti = useConfettiStore()
    const onClick = async () => {
        try {
            setIsLoading(true)
            if (isPublished) {
                await axios.patch(`/api/courses/${courseId}/unpublish`)
                toast.success("Course Unpublised")
            } else {
                await axios.patch(`/api/courses/${courseId}/publish`)
                toast.success("Course Publish")
                confetti.onOpen()

            }
            router.refresh()

        } catch (error) {
            console.log(error, 'error')
            toast.error("something went wrong")
        } finally {
            setIsLoading(false)
        }
    }


    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}`)
            toast.success("Course Deleted")
            router.refresh()
            return router.push(`/teacher/courses`)
        } catch (error) {
            console.log(error, 'error')
            toast.error("something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex items-center gap-x-2' >
            <Button onClick={onClick} disabled={disabled || isLoading} variant={"outline"} size={"sm"}>
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}  >
                <Button disabled={isLoading} size={"sm"}>
                    <Trash className='h-4 w-4' />
                </Button>
            </ConfirmModal>

        </div>
    )
}

export default CourseActions