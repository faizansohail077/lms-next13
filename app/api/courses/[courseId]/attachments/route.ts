import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { url } = await req.json()
        const { userId } = auth()
        const { courseId } = params

        if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })

        if (!courseOwner) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
        const attachments = await db.attachment.create({
            data: {
                url,
                name: url.split('/').pop(),
                courseId
            }
        })
        return NextResponse.json({ msg: "Course Created",attachments })
    } catch (error) {
        console.log(error, 'error attachments')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}