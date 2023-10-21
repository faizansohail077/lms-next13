"use client";
import { useAuth } from "@clerk/nextjs";
export default function Home() {
    const { isLoaded, userId} = useAuth();
    if (!isLoaded || !userId) {
        return null;
    }
    return (
        <div className="">
           
        </div>
    )
}
