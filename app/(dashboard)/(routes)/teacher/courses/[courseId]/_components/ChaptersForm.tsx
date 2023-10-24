"use client"
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Form, FormControl, FormMessage, FormItem, FormField } from "@/components/ui/form";
import { Button } from '@/components/ui/button'
import { Loader2, Pencil, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Course, Chapter } from '@prisma/client'
import { Input } from '@/components/ui/input'
import ChaptersList from './ChaptersList'

interface ChaptersFormProps {
    initialData: Course & { chapters: Chapter[] }
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1)
})
const ChaptersForm = ({ courseId, initialData }: ChaptersFormProps) => {
    const [isCreating, setIsCreating] = useState(false)
    const [isUpdating, setIsUpdaing] = useState(false)

    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const { isValid, isSubmitting } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post(`/api/courses/${courseId}/chapters`, values)
            toast.success("Chapter Created")
            toggleCreating()
            router.refresh()
        } catch (error) {
            console.log(error, 'error')
            toast.error("Something Went Wrong")
        }
    }

    const onReorder = async (updateData: { id: string, position: number }[]) => {
        try {

            setIsUpdaing(true)
            await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
                list: updateData
            })
            toast.success("Chapter Reordered")
            router.refresh()
        } catch (error) {
            toast.error("Something Went Wrong")
            console.log(error, 'error reoderd')
        } finally {
            setIsUpdaing(false)
        }

    }

    const onEdit = (id: string) => {
        router.push(`/teacher/courses/${courseId}/chapters/${id}`)
    }


    const toggleCreating = () => {
        setIsCreating((current) => !current)
    }
    return (
        <div className='relative mt-6 bg-slate-100 rounded-md p-4' >
            {isUpdating && (
                <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center ">
                    <Loader2 className='w-6 h-6 animate-spin text-sky-700' />
                </div>
            )}
            <div className="font-medium flex items-center justify-between">
                Course Chapters
                <Button onClick={toggleCreating} variant={"ghost"} >
                    {isCreating && (<>Cancel</>)}
                    {!isCreating && <>
                        <PlusCircle className='h-4 w-4 mr-2' />
                        Add a Chapter
                    </>
                    }
                </Button>
            </div>

            {isCreating && <Form  {...form}>
                <form className='space-y-4 mt-4' action="" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name='title' render={({ field }) => {
                        return (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} {...field} placeholder='e.g "Introduction To Course"' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )
                    }} />
                    <Button disabled={!isValid || isSubmitting} >
                        Create
                    </Button>
                </form>
            </Form>
            }

            {!isCreating && (
                <div className={cn("text-sm mt-2 ", !initialData.chapters.length && "text-slate-500 italic")} >
                    {!initialData.chapters.length && "No Chapters"}
                    {/* Add list of chapters */}
                    <ChaptersList onEdit={onEdit} onReorder={onReorder} items={initialData.chapters || []} />
                </div>
            )}
            {!isCreating && (
                <div className='text-xs text-muted-foreground mt-4' >
                    Drag and Drop to reorder the chapters
                </div>
            )}
        </div>
    )
}

export default ChaptersForm