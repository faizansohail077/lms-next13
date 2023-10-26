"use client"
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/formats'
import React from 'react'

interface CourseEnrollButtonProps {
    price: number;
    courseId: string
}

const CourseEnrollButton = ({ courseId, price }: CourseEnrollButtonProps) => {
    return (
        <Button size={"sm"} className='w-full md:w-auto ' >Enroll for {formatPrice(price)}</Button>
    )
}

export default CourseEnrollButton