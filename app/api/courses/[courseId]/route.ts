import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

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