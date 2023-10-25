import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = auth()
        if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if (!courseOwner) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })


        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        })


        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,

            }
        })

        if (!chapter || !muxData || !chapter.title || !chapter.descirption || !chapter.videoUrl) {
            return NextResponse.json({ msg: "Missing Required Fields" }, { status: 400 })
        }

        const publishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: true
            }
        })

        // TODO handle video upload
        return NextResponse.json({ msg: "Chapter Published", publishChapter })
    } catch (error) {
        console.log(error, 'error patch')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}