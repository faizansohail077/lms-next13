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
import { cn } from '@/lib/utils'
import { Course } from '@prisma/client'
import { Input } from '@/components/ui/input'
import { formatPrice } from '@/lib/formats'

interface PriceFormProps {
    initialData: Course
    courseId: string
}

const formSchema = z.object({
    price: z.coerce.number()
})

const PriceForm = ({ courseId, initialData }: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData.price || undefined
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
    return (
        <div className='mt-6 bg-slate-100 rounded-md p-4' >
            <div className="font-medium flex items-center justify-between">
                Course Price
                <Button onClick={toggleEddit} variant={"ghost"} >
                    {isEditing && (<>Cancel</>)}
                    {!isEditing && <>
                        <Pencil className='h-4 w-4 mr-2' />
                        Edit Price
                    </>
                    }
                </Button>
            </div>
            {!isEditing && <p className={cn("text-sm mt-2", !initialData.price && "text-slate-500 italic")} >
                {initialData.price ? formatPrice(initialData.price) : "No Price"}
            </p>}

            {isEditing && <Form  {...form}>
                <form className='space-y-4 mt-4' action="" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField control={form.control} name='price' render={({ field }) => {
                        return (
                            <FormItem>
                                <FormControl>
                                    <Input disabled={isSubmitting} placeholder='Price For Your course' {...field} type='number' step={0.01} />
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

export default PriceForm