"use client"

import * as z from 'zod'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const formSchema = z.object({
    title: z.string().min(1, { message: "title is required" })
})

const CreateCourse = () => {
    const router = useRouter()

    const form = useForm<z.infer<(typeof formSchema)>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })
    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response: any =await axios.post('/api/course', values)
            router.push(`/teacher/courses/${response?.data?.id}`)
        } catch (error) {
            toast.error("something went wrong")
            console.log(error, 'error something went worng')
        }
    }

    return (
        <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6' >
            <div className="">
                <h1 className='text-2xl' >Name your course</h1>
                <p className='text-sm text-slate-600 mb-5' >What would you like to name your course ? Don't worry, you can change it later</p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Course title</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="eg Advance Web development" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        What will you teach in this course
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center gap-x-2">
                            <Link href={'/'}>
                                <Button type="button" variant={"ghost"} >Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting} >Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CreateCourse