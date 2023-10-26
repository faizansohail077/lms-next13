import { Menu } from 'lucide-react'
import React from 'react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"

import { Chapter, Course, UserProgress } from '@prisma/client';
import CourseSidebar from './CourseSidebar';

interface CourseMobileSideBarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress: UserProgress[] | null
        })[]
    };
    progressCount: number
}

const CourseMobileSideBar = ({ course, progressCount }: CourseMobileSideBarProps) => {
    return (
        <Sheet>
            <SheetTrigger className='md:hidden pr-4 hover:opacity-75 transition' >
                <Menu />
            </SheetTrigger>
            <SheetContent className='p-0 bg-white w-72' side={"left"} >
                <CourseSidebar course={course} progressCount={progressCount} />
            </SheetContent>
        </Sheet>
    )
}

export default CourseMobileSideBar