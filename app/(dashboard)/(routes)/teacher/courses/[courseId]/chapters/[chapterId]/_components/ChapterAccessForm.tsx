"use client"
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Form, FormControl, FormItem, FormField, FormDescription } from "@/components/ui/form";
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Chapter } from '@prisma/client'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'

interface ChapterAccessFormProps {
    initialData: Chapter
    courseId: string,
    chapterId: string
}

const formSchema = z.object({
    isFree: z.boolean().default(false)
})
const ChapterAccessForm = ({ courseId, initialData, chapterId }: ChapterAccessFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { isFree: !!initialData.isFree }
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
                Chapter access
                <Button onClick={toggleEddit} variant={"ghost"} >
                    {isEditing && (<>Cancel</>)}
                    {!isEditing && <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit access
                    </>
                    }
                </Button>
            </div>
            {!isEditing && <div className={cn("text-sm mt-2", !initialData.isFree && "text-slate-500 italic")} >
                {!initialData.isFree ? "This Chapter is Not Free" : "This Chapter is Free For Preview"}
            </div>}

            {isEditing && <Form  {...form}>
                <form className='space-y-4 mt-4' action="" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name='isFree' render={({ field }) => {
                        return (
                            <FormItem className='flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4' >
                                <FormControl>
                                    <input type='checkbox' checked={field.value} onChange={field.onChange} />
                                    {/* <Checkbox checked={field.value} onChange={field.onChange} /> */}
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormDescription >Check this form if you want to make chapter free for preview</FormDescription>
                                </div>
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

export default ChapterAccessForm