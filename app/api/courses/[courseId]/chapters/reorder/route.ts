import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { courseId: string } }) {
    try {
        const { courseId } = params
        const { userId } = auth()
        const { list } = await req.json()
        if (!userId) return NextResponse.json({ msg: "UnAuthorized" }, { status: 401 })

        const courseOwner = db.course.findUnique({
            where: {
                userId,
                id: courseId
            }
        })
        if (!courseOwner) return NextResponse.json({ msg: "UnAuthorized" }, { status: 401 })


        for (let item of list) {
            await db.chapter.update({
                where: { id: item.id },
                data: { position: item.position }
            })
        }
        return NextResponse.json({ msg: "Success" }, { status: 200 })
    } catch (error) {
        console.log(error, 'error chapter')
        return NextResponse.json({ msg: "Something Went Wrong", error }, { status: 500 })
    }
}