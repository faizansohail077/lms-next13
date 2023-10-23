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

interface TitleFormProps {
    initialData: {
        title: string,
    }
    courseId: string
}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "Title is Required"
    })
})
const TitleForm = ({ courseId, initialData }: TitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    })

    const { isValid, isSubmitting } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
         const data=   await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course Edited")
            console.log(data,'data')
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
                Course Title
                <Button onClick={toggleEddit} variant={"ghost"} >
                    {isEditing && (<>Cancel</>)}
                    {!isEditing && <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Title
                    </>
                    }
                </Button>
            </div>
            {!isEditing && <p className='text-sm mt-2' >
                {initialData.title}
            </p>}

            {isEditing && <Form  {...form}>
                <form className='space-y-4 mt-4' action="" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name='title' render={({ field }) => {
                        return (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} {...field} placeholder='e.g "advance web development"' />
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

export default TitleForm