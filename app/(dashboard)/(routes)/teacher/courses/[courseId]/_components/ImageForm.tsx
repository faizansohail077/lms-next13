"use client"
import React, { useState } from 'react'
import axios from 'axios'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { ImageIcon, Pencil, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Course } from '@prisma/client'
import Image from 'next/image'
import FileUpload from '@/components/FileUpload'

interface ImageFormProps {
    initialData: Course
    courseId: string
}

const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "Image is Required"
    })
})
const ImageForm = ({ courseId, initialData }: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()


    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const data = await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course Edited")
            console.log(data, 'data')
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
                Course Image
                <Button onClick={toggleEddit} variant={"ghost"} >
                    {isEditing && (<>Cancel</>)}

                    {!isEditing && !initialData.imageUrl && <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add an Image
                    </>
                    }
                    {!isEditing && initialData.imageUrl && <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Image
                    </>
                    }
                </Button>
            </div>
            {!isEditing && !initialData.imageUrl && (

                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                    <ImageIcon className='h-10 w-10 text-slate-500' />
                </div>
            )}
            {!isEditing && initialData.imageUrl && (
                <div className="relative aspect-video mt-2">
                    {initialData?.imageUrl && <Image alt='Upload' fill className='object-conver rounded-md' src={initialData?.imageUrl} />}
                </div>
            )}

            {isEditing && (
                <div className="">
                    <FileUpload endPoint='courseImage' onChange={(url) => {
                        if (url)
                            onSubmit({ imageUrl: url })
                    }} />
                    <div className="text-xs  text-muted-foreground mt-4">
                        16:9 aspect ratio recommended
                    </div>
                </div>)
            }
        </div>
    )
}

export default ImageForm