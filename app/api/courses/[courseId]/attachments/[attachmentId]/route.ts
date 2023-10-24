import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string, attachmentId: string } }) {
    try {
        const { userId } = auth()
        const { courseId, attachmentId } = params

        if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        })

        if (!courseOwner) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
        const attachments = await db.attachment.delete({
            where: {
                id: attachmentId
            }
        })
        return NextResponse.json({ msg: "Course Created", attachments })
    } catch (error) {
        console.log(error, 'error attachments')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}