"use client";
import { useAuth } from "@clerk/nextjs";

import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'

export default function Home() {
    const { isLoaded, userId} = useAuth();
    if (!isLoaded || !userId) {
        return null;
    }
    return (
        <div className="">
            <h1 className='text-lg font-bold text-black'>Hello World</h1>
            <Button>Hello</Button>
            <UserButton afterSignOutUrl="/" />
        </div>
    )
}
