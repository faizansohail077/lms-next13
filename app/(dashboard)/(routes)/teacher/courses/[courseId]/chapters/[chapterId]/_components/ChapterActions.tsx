"use client"
import ConfirmModal from '@/components/modals/confirm-modal'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { redirect, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

interface ChapterActionsProps {
    disabled: boolean
    chapterId: string
    courseId: string
    isPublished: boolean
}

const ChapterActions = ({ chapterId, courseId, disabled, isPublished }: ChapterActionsProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const onDelete = async () => {
        try {
            setIsLoading(true)
            await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
            toast.success("Chapter Deleted")
            router.refresh()
            return router.push(`/teacher/courses/${courseId}`)
        } catch (error) {
            console.log(error, 'error')
            toast.error("something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className='flex items-center gap-x-2' >
            <Button onClick={() => { }} disabled={disabled || isLoading} variant={"outline"} size={"sm"}>
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

export default ChapterActions