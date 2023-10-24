"use client"
import { Chapter } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { DropResult, DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'
import { Grip, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
interface ChaptersListProps {
    onEdit: (id: string) => void
    onReorder: (updateData: { id: string, position: number }[]) => void
    items: Chapter[]
}

const ChaptersList = ({ items, onEdit, onReorder }: ChaptersListProps) => {
    const [isMounted, setIsMounted] = useState(false)
    const [chapters, setChapters] = useState(items)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        setChapters(items)
    }, [items])
    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(chapters)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)
        const startIndex = Math.min(result.source.index, result.destination.index)
        const endIndex = Math.max(result.source.index, result.destination.index)
        const updatedChapters = items.slice(startIndex, endIndex + 1)
        setChapters(items)
        const buldUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex((item) => item.id === chapter.id)
        }))
        onReorder(buldUpdateData)
    }
    if (!isMounted) return null

    return (
        <DragDropContext onDragEnd={onDragEnd} >
            <Droppable droppableId="chapters" >
                {(provider) => {
                    return (
                        <div className="" {...provider.droppableProps} ref={provider.innerRef}>
                            {chapters.map((chapter, index) => {
                                return (
                                    <Draggable index={index} draggableId={chapter.id} key={chapter.id}  >
                                        {(provided) => {
                                            return (
                                                <div className={cn("flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md text-sm mb-4",
                                                    chapter.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                                                )}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                >

                                                    <div className={cn("px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                        chapter.isPublished && "border-r-sky-200 hover:bg-sky-200"
                                                    )}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <Grip className='w-4 h-4' />
                                                    </div>
                                                    {chapter.title}
                                                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                        {chapter.isFree && (
                                                            <Badge>Free</Badge>
                                                        )}
                                                        <Badge className={cn("bg-slate-500", chapter.isPublished && "bg-sky-700")} >
                                                            {chapter.isPublished ? "isPublished" : "Draft"}
                                                        </Badge>

                                                        <Pencil onClick={() => onEdit(chapter.id)} className='w-4 h-4 cursor-pointer hover:opacity-75 transition' />

                                                    </div>
                                                </div>
                                            )
                                        }}
                                    </Draggable>
                                )
                            })}
                            {provider.placeholder}
                        </div>
                    )
                }}

            </Droppable>
        </DragDropContext>
    )
}

export default ChaptersList