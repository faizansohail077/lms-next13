"use client"
import React, { useState } from 'react'
import axios from 'axios'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { Pencil, PlusCircle, Video } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter, MuxData } from '@prisma/client'
import FileUpload from '@/components/FileUpload'
import MuxPlayer from "@mux/mux-player-react"
interface ChapterVideoFormProps {
    initialData: Chapter & { muxData?: MuxData | null }
    courseId: string
    chapterId: string
}

const formSchema = z.object({
    videoUrl: z.string().min(1)
})
const ChapterVideoForm = ({ courseId, initialData, chapterId }: ChapterVideoFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter Edited")
            toggleEddit()
            router.refresh()
        } catch (error) {
            console.log(error, 'error')
            toast.error("Something Went Wrong")
        }
    }
    const toggleEddit = () => {
        setIsEditing((current) => !current)
    }
    return (
        <div className='mt-6 bg-slate-100 rounded-md p-4' >
            <div className="font-medium flex items-center justify-between">
                Chapter Video
                <Button onClick={toggleEddit} variant={"ghost"} >
                    {isEditing && (<>Cancel</>)}

                    {!isEditing && !initialData.videoUrl && <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add a Video
                    </>
                    }
                    {!isEditing && initialData.videoUrl && <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Video
                    </>
                    }
                </Button>
            </div>
            {!isEditing && !initialData.videoUrl && (

                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <Video className='h-10 w-10 text-slate-500' />
                </div>
            )}
            {!isEditing && initialData.videoUrl && (
                <div className="relative aspect-video mt-2">
                    {initialData?.videoUrl && <>
                    <MuxPlayer playbackId={initialData?.muxData?.playbackId || ""} />
                    </>}
                </div>
            )}

            {isEditing && (
                <div className="">
                    <FileUpload endPoint='chapterVideo' onChange={(url) => {
                        if (url)
                            onSubmit({ videoUrl: url })
                    }} />
                    <div className="text-xs  text-muted-foreground mt-4">
                        upload this chapter's video
                    </div>
                </div>)
            }
            {initialData.videoUrl && !isEditing && (
                <div className="text-xs text-muted-foreground mt-2">
                    videos can take few minutes to process. Refresh the page if video does not appear.
                </div>
            )}
        </div>
    )
}

export default ChapterVideoForm