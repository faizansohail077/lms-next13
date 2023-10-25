"use client"
import { Category } from '@prisma/client'
import React from 'react'
import { FcEngineering, FcOldTimeCamera, FcSportsMode, FcMusic, FcSalesPerformance, FcMultipleDevices, FcFilmReel } from 'react-icons/fc'

interface CategoriesProps {
    items: Category[]
}
import { IconType } from 'react-icons'
import CategoryItem from './CategoryItem'

const iconMap: Record<Category["name"], IconType> = {
    "Music": FcMusic,
    "Photography": FcOldTimeCamera,
    "Fitness": FcSportsMode,
    "Accounting": FcSalesPerformance,
    "Computer Science": FcMultipleDevices,
    "Filming": FcFilmReel,
    "Engineering": FcEngineering

}

const Categories = ({ items }: CategoriesProps) => {
    return (
        <div className='flex items-center gap-x-2 overflow-x-auto pb-2' >
            {items?.map((item) => {
                return (
                    <CategoryItem value={item?.id} key={item?.id} label={item?.name} icon={iconMap[item?.name]} />
                )
            })}
        </div>
    )
}

export default Categories