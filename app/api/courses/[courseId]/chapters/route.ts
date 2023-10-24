import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = params
        const { userId } = auth()
        const { title } = await req.json()

        if (!userId) return NextResponse.json({ msg: "UnAuthorized" }, { status: 401 })

        const courseOwner = db.course.findUnique({
            where: {
                userId,
                id: courseId
            }
        })
        if (!courseOwner) return NextResponse.json({ msg: "UnAuthorized" }, { status: 401 })


        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId
            },
            orderBy: {
                position: "desc"
            }
        })
        const newPosition = lastChapter ? lastChapter?.position + 1 : 1
        const chapter = await db.chapter.create({
            data: {
                title,
                courseId,
                position: newPosition
            }
        })

        return NextResponse.json({ chapter })
    } catch (error) {
        console.log(error, 'error chapter')
        return NextResponse.json({ msg: "Something Went Wrong" ,error}, { status: 500 })
    }
}