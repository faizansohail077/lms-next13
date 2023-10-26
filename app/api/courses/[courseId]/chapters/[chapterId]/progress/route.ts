import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { courseId: string, chapterId: string } }) {
    try {
        const { userId } = auth()
        const { isCompleted } = await req.json()

        if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })
        const userProgress = await db.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId
                }
            },
            update: {
                isCompleted
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted
            }
        })

        // TODO handle video upload
        return NextResponse.json({ msg: "Chapter Published", userProgress })
    } catch (error) {
        console.log(error, 'error chapter id progress')
        return NextResponse.json({ msg: "Somehing went wront" })
    }
}