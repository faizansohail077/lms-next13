import { IconBadge } from '@/components/IconBadge'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'
import TitleFrom from './_components/TitleFrom'
import DescriptionForm from './_components/DescriptionForm'
import ImageForm from './_components/ImageForm'
import CategoryForm from './_components/CategoryForm'
import PriceForm from './_components/PriceForm'
import AttachmentForm from './_components/AttachmentForm'
import ChaptersForm from './_components/ChaptersForm'
import Banner from '@/components/banner'
import CourseActions from './_components/CourseActions'


const CourseDetail = async ({ params: { courseId } }: { params: { courseId: string } }) => {
    const { userId } = auth()
    if (!userId) return redirect('/')
    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachments: {
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    })

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    if (!course) return redirect('/')
    const requiredFields = [
        course.title,
        course.description,
        course.categoryId,
        course.imageUrl,
        course.price,
        course.chapters.some((chapter) => chapter.isPublished)
    ]
    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length

    const completionText = `(${completedFields}/${totalFields})`
    const isComplete = requiredFields.every(Boolean)
    return (
        <>
        {!course.isPublished && (
            <Banner label='This course is unpublished it will not be visible to students' />
        )}
            <div className='p-6' >
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className='font-medium text-xl' >Course Setup</h1>
                        <span className='text-sm text-slate-700' >Complete All Fields {completionText}</span>
                    </div>
                    {/* add action */}
                    <CourseActions disabled={!isComplete} isPublished={course.isPublished} courseId={courseId} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h1 className='text-xl' >Customize Your Course</h1>
                        </div>
                        <TitleFrom initialData={course} courseId={course.id} />
                        <DescriptionForm initialData={course} courseId={course.id} />
                        <ImageForm initialData={course} courseId={course.id} />
                        <CategoryForm options={categories.map((item) => ({
                            label: item.name,
                            value: item.id
                        }))} initialData={course} courseId={course.id} />
                    </div>

                    <div className="space-y-6">
                        <div className="">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={ListChecks} />
                                <h2 className='text-xl' >Course Chapters</h2>
                            </div>
                        </div>
                        <ChaptersForm initialData={course} courseId={course.id} />

                        {/*  */}
                        <div className="">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={CircleDollarSign} />
                                <h2 className='text-xl' >Sell Your Course</h2>
                            </div>
                            <PriceForm initialData={course} courseId={course.id} />
                        </div>
                        {/*  */}
                        <div className="">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={File} />
                                <h2 className='text-xl' >Resources & Attachments</h2>
                            </div>
                            <AttachmentForm initialData={course} courseId={course.id} />
                        </div>
                    </div>


                </div>

            </div>
        </>
    )
}

export default CourseDetail