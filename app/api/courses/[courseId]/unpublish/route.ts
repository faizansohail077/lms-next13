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
           
        })
        if (!course) return NextResponse.json({ msg: "Not Found" }, { status: 404 })


        const unPublishCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId
            },
            data: {
                isPublished: false
            }
        })

        return NextResponse.json({ msg: "Chapter Published", unPublishCourse })
    } catch (error) {
        console.log(error, 'error patch')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}