import Mux from '@mux/mux-node'
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";


const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
)

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = auth()
        if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }

        })
        if (!chapter) return NextResponse.json({ msg: "Not Found" }, { status: 404 })
       
        if (chapter.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,

                }
            })
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }
        }

        const deletedChapter = await db.chapter.delete({
            where: {
                id: params.chapterId
            }
        })

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        })
        if (!publishedChaptersInCourse) {
            await db.course.update({
                where: {
                    id: params.courseId,
                },
                data: {
                    isPublished: false
                }
            })
        }
        // TODO handle video upload
        return NextResponse.json({ msg: "Chapter Updated" })
    } catch (error) {
        console.log(error, 'error delete')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}


export async function PATCH(req: NextRequest, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { isPublished, ...values } = await req.json()
        const { userId } = auth()
        if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
        const chapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: { ...values }
        })
        if (values.videoUrl) {
            const existingMuxData = await db.muxData.findFirst({
                where: {
                    chapterId: params.chapterId,

                }
            })
            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId)
                await db.muxData.delete({
                    where: {
                        id: existingMuxData.id
                    }
                })
            }

            const assests = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test: false

            })
            await db.muxData.create({
                data: {
                    chapterId: params.chapterId,
                    assetId: assests.id,
                    playbackId: assests.playback_ids?.[0]?.id
                }
            })
        }
        // TODO handle video upload
        return NextResponse.json({ msg: "Chapter Updated", chapter })
    } catch (error) {
        console.log(error, 'error patch')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}