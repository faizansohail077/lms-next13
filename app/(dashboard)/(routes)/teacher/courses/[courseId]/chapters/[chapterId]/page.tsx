import { IconBadge } from '@/components/IconBadge'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs'
import { ArrowLeft, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { boolean } from 'zod'
import ChapterTitleFrom from './_components/ChapterTitleFrom'

const Chapter = async ({ params }: { params: { courseId: string, chapterId: string } }) => {

    const { userId } = auth()

    if (!userId) return redirect('/')

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId
        },
        include: {
            muxData: true
        }
    })
    if (!chapter) return redirect('/')

    const requiredFields = [
        chapter.descirption,
        chapter.videoUrl,
        chapter.title
    ]

    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completetionText = (`${completedFields}/${totalFields}`)

    return (
        <div className='p-6' >
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link href={`/teacher/courses/${params.courseId}`} className='flex items-center text-xs hover:opacity-75 transition mb-6'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Back to course Setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className='text-2xl font-medium' >Chapter Creating</h1>
                            <span className='text-sm text-slate-500' >Complete all fields {completetionText}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div className="">
                        <div className="flex items-center gap-x-2">
                            <IconBadge icon={LayoutDashboard} />
                            <h2 className='text-xl' >Customize Your Chapter</h2>
                        </div>
                        {/* todo  */}
                        <ChapterTitleFrom initialData={chapter} chapterId={params.chapterId} courseId={params.courseId} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chapter