"use client"
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Form, FormControl, FormMessage, FormItem, FormField } from "@/components/ui/form";
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter } from '@prisma/client'
import { cn } from '@/lib/utils'

interface ChapterDescriptionFromProps {
    initialData: Chapter
    courseId: string,
    chapterId: string
}

const formSchema = z.object({
    descirption: z.string().min(1, {
        message: "descirption is Required"
    })
})
const ChapterDescriptionFrom = ({ courseId, initialData, chapterId }: ChapterDescriptionFromProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { descirption: initialData.descirption || "" }
    })

    const { isValid, isSubmitting } = form.formState

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
                Chapter Description
                <Button onClick={toggleEddit} variant={"ghost"} >
                    {isEditing && (<>Cancel</>)}
                    {!isEditing && <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Description
                    </>
                    }
                </Button>
            </div>
            {!isEditing && <p className={cn("text-sm mt-2", !initialData.descirption && "text-slate-500 italic")} >
                {initialData.descirption ? initialData.descirption : "No Description"}
            </p>}

            {isEditing && <Form  {...form}>
                <form className='space-y-4 mt-4' action="" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name='descirption' render={({ field }) => {
                        return (
                            <FormItem>
                                <FormControl>

                                    <Input disabled={isSubmitting} {...field} placeholder='e.g "Introduction To Course"' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }} />
                    <div className="flex items-center gap-x-2">
                        <Button disabled={!isValid || isSubmitting} >
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
            }
        </div>
    )
}

export default ChapterDescriptionFrom