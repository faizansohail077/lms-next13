"use client"
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Form, FormControl, FormMessage, FormItem, FormField } from "@/components/ui/form";
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Course } from '@prisma/client'
import { ComboBox } from '@/components/ui/combobox'

interface DescriptionFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string, value: string }[]
}

const formSchema = z.object({
    categoryId: z.string().min(1, {
        message: "Category is Required"
    })
})
const CategoryForm = ({ courseId, initialData, options }: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData.categoryId || ""
        }
    })

    const { isValid, isSubmitting } = form.formState

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
    const selectedOption = options.find(option => option.value === initialData.categoryId)
    return (
        <div className='mt-6 bg-slate-100 rounded-md p-4' >
            <div className="font-medium flex items-center justify-between">
                Course Category
                <Button onClick={toggleEddit} variant={"ghost"} >
                    {isEditing && (<>Cancel</>)}
                    {!isEditing && <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Category
                    </>
                    }
                </Button>
            </div>
            {!isEditing && <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")} >
                {initialData.categoryId ? selectedOption?.label : "No Category"}
            </p>}

            {isEditing && <Form  {...form}>
                <form className='space-y-4 mt-4' action="" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name='categoryId' render={({ field }) => {
                        return (
                            <FormItem>
                                <FormControl>
                                    <ComboBox options={options} {...field} />
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

export default CategoryForm