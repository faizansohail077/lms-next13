import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

const Courses = async ({ params }: { params: { courseId: string } }) => {
  const courses = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true
        },
        orderBy: {
          position: "asc"
        }
      }
    },

  })
  if (!courses) return redirect("/")

  return redirect(`/courses/${courses.id}/chapters/${courses?.chapters[0]?.id}`)
}

export default Courses