import { Category, Course } from '@prisma/client'
import React from 'react'
import CourseCard from '@/components/CourseCard';

type CoursesWithListWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null
}

interface CoursesListProps {
    items: CoursesWithListWithCategory[]
}
const CoursesList = ({ items }: CoursesListProps) => {
    return (
        <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items?.map((item) => {
                    return (
                        <CourseCard chaptersLength={item.chapters.length} price={item?.price!} progress={item?.progress} category={item?.category?.name!} key={item?.id} id={item?.id} title={item?.title} imageUrl={item?.imageUrl!} />
                    )
                })}
            </div>
            {items?.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No Course Found
                </div>
            )}
        </div>
    )
}

export default CoursesList