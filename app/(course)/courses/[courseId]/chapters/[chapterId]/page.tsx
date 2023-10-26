import { getChapters } from '@/actions/getChapters'
import Banner from '@/components/banner'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React from 'react'
import VideoPlayer from './_components/VideoPlayer'
import CourseEnrollButton from './_components/CourseEnrollButton'
import { Separator } from '@/components/ui/separator'
import Preview from '@/components/Preview'
import { File } from 'lucide-react'
import CourseProgressButton from './_components/CourseProgressButton'

const ChapterId = async ({ params }: { params: { courseId: string, chapterId: string } }) => {
    const { chapterId, courseId } = params
    const { userId } = auth()
    if (!userId) return redirect('/')
    const { chapter, course, muxData, nextChapter, purchase, userProgress, attachments } = await getChapters({ chapterId, courseId, userId })
    if (!chapter || !course) return redirect("/")
    const isLocked = !chapter?.isFree && !purchase
    const completeOnEnd = !!purchase && userProgress?.isCompleted
    

    return (
        <div>
            {userProgress?.isCompleted && (
                <Banner label='You already completed this chapter' variant={"success"} />
            )}
            {isLocked && (
                <Banner label='You need to purchase this to watch this chapter' variant={"warning"} />
            )}
            <div className="flex flex-col max-w-4xl mx-auto pb-20">
                <div className="p-4">
                    <VideoPlayer chapterId={chapterId} isLocked={isLocked} completeOnEnd={completeOnEnd!} nextChapterId={nextChapter?.id} playbackId={muxData?.playbackId!} title={chapter.title} courseId={courseId} />
                </div>
                <div className="">
                    <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                        <h2 className='text-2xl font-semibold mb-2' >Chapter Title</h2>
                        {purchase ? (
                            <CourseProgressButton courseId={courseId} chapterId={chapterId} nextChapterId={nextChapter?.id!} isCompleted={!!userProgress?.isCompleted} />
                        ) : (
                            <CourseEnrollButton courseId={courseId} price={course?.price!} />
                        )}
                    </div>
                    <Separator />
                    <div>
                        <Preview value={chapter.descirption!} />
                    </div>
                    {!!attachments?.length && (
                        <>
                            <Separator />
                            <div className="p-4">
                                {attachments?.map((attachment) => {
                                    return (
                                        <a className='flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline' key={attachment.id} href={attachment.url} target='_blank'>
                                            <File />
                                            <p className='line-clamp-1 ' >
                                                {attachment.name}
                                            </p>
                                        </a>
                                    )
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    )
}

export default ChapterId