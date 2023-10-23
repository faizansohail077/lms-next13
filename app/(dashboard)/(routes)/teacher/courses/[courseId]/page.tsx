import { IconBadge } from '@/components/IconBadge'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { LayoutDashboard } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import TitleFrom from './_components/TitleFrom'
import DescriptionForm from './_components/DescriptionForm'

const CourseDetail = async ({ params: { courseId } }: { params: { courseId: string } }) => {
    const { userId } = auth()
    if (!userId) return redirect('/')
    const course = await db.course.findUnique({
        where: {
            id: courseId
        }
    })
    if (!course) return redirect('/')
    const requiredFields = [
        course.title,
        course.description,
        course.categoryId,
        course.imageUrl,
        course.price
    ]
    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `(${completedFields}/${totalFields})`

    return (
        <div className='p-6' >
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className='font-medium text-xl' >Course Setup</h1>
                    <span className='text-sm text-slate-700' >Complete All Fields {completionText}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="">
                    <div className="flex items-center gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h1 className='text-xl' >Customize Your Course</h1>
                    </div>
                    <TitleFrom initialData={course} courseId={course.id} />
                    <DescriptionForm initialData={course} courseId={course.id} />
                </div>
            </div>

        </div>
    )
}

export default CourseDetail