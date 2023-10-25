import { db } from "@/lib/db"

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
    try {
        const publishedChapter = await db.chapter.findMany({
            where: {
                courseId,
                isPublished: true
            },
            select: {
                id: true
            }
        })

        const publishChapterId = publishedChapter.map((chapter) => chapter.id)

        const validCompleteChapters = await db.userProgress.count({
            where: {
                userId,
                chapterId: {
                    in: publishChapterId
                },
                isCompleted: true
            }
        })

        const progressPercentage = (validCompleteChapters / publishChapterId.length) * 100

        return progressPercentage

    } catch (error) {
        console.log(error, 'progress error')
        return 0
    }
}
