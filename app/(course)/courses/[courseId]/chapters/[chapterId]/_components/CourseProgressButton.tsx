"use client"
import { Button } from '@/components/ui/button';
import { useConfettiStore } from '@/hooks/useConfettiStore';
import axios from 'axios';
import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

interface CourseProgressButtonProps {
    courseId: string;
    chapterId: string;
    nextChapterId: string;
    isCompleted: boolean;
}


const CourseProgressButton = ({ chapterId, courseId, isCompleted, nextChapterId }: CourseProgressButtonProps) => {
    const Icon = isCompleted ? XCircle : CheckCircle
    const router = useRouter()
    const confetti = useConfettiStore()
    const [isLoading, setIsLoading] = useState(false)

    const onClick = async () => {
        try {
            setIsLoading(true)
            await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                isCompleted: !isCompleted
            })

            if (!isCompleted && !nextChapterId) {
                confetti.onOpen()
            }
            if (!isCompleted && nextChapterId) {
                router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
            }

            toast.success("Progress Updated")
            router.refresh()
        } catch (error) {
            console.log(error, 'error progress bar')
            toast.error("Something Went Wrong")
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <>
            <Button onClick={onClick} disabled={isLoading} type='button' className='w-full md:w-auto' variant={isCompleted ? "outline" : "success"} >
                {isCompleted ? "Not Completed" : "Mark as Complete"}
                <Icon className='h-4 w-4 ml-2' />
            </Button>
        </>
    )
}

export default CourseProgressButton