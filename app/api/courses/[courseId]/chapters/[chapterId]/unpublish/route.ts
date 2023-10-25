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

        const unpublishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPublished: false
            }
        })

        const publishChapterInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        })

        if (!publishChapterInCourse) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            }
            )
        }

        // TODO handle video upload
        return NextResponse.json({ msg: "Chapter UnPublished", unpublishChapter })
    } catch (error) {
        console.log(error, 'error patch')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}