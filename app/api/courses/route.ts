import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = auth()
        const { title } = await req.json()
        console.log(title,'title')
        if (!userId) return NextResponse.json({ msg: "Unauthorized" }, { status: 401 })

        const course = await db.course.create({
            data: {
                title: title,
                userId
            }
        })

        return NextResponse.json(course)
    } catch (error) {
        return NextResponse.json({ msg: "Internal Error" }, { status: 500 })
    }
}