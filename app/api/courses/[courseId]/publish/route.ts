import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
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

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })
        if (!course) return NextResponse.json({ msg: "Not Found" }, { status: 404 })

        const hasPublishedChaper = await course.chapters.some((chapter) => chapter.isPublished)

        if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChaper) {
            return NextResponse.json({ msg: "Missing Required Fields" }, { status: 400 })
        }

        const publishCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                isPublished: true
            }
        })

        return NextResponse.json({ msg: "Chapter Published", publishCourse })
    } catch (error) {
        console.log(error, 'error patch')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}