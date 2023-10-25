import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Mux from '@mux/mux-node'
const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
)

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { userId } = auth()
        if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
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
        for (const chapters of course.chapters) {
            if (chapters?.muxData?.assetId) {
                await Video.Assets.del(chapters?.muxData?.assetId)
            }
        }
        const deletedCourse = await db.course.delete({
            where: {
                id: params.courseId
            }
        })

        return NextResponse.json({ msg: "Course Deleted", deletedCourse })
    } catch (error) {
        console.log(error, 'error patch')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const values = await req.json()
        const { userId } = auth()
        if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
        const course = await db.course.update({
            where: {
                id: params.courseId,
                userId: userId
            },
            data: { ...values }
        })
        return NextResponse.json({ msg: "Course Created", course })
    } catch (error) {
        console.log(error, 'error patch')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}