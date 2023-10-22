import React from 'react'

const CourseDetail = ({ params: { courseId } }: { params: { courseId: string } }) => {
    return (
        <div>CourseDetail {courseId} </div>
    )
}

export default CourseDetail