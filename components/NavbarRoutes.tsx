"use client"
import { UserButton } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'

const NavbarRoutes = () => {
    const pathname = usePathname()
    const router = useRouter()
    const isTeacherPage = pathname.startsWith('/teachers')
    const isPlayerPage = pathname.includes('/chapter')
    return (
        <div className='flex gap-x-2 ml-auto' >
            <UserButton />
        </div>
    )
}

export default NavbarRoutes