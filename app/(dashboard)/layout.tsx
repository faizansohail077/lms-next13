import React, { ReactNode } from 'react'
import Sidebar from './_components/Sidebar'
import Navbar from './_components/Navbar'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="h-full">
            <div className="h-[80px] md:ml-56 fixed inset-y-0 w-full z-50">
                <Navbar />
            </div>
            <div className='h-full hidden md:flex w-56 flex-col fixed inset-y-0 z-50' >
                <Sidebar />
            </div>
            <main className='md:ml-56 pt-[80px] h-full' >

                {children}
            </main>
        </div>
    )
}

export default DashboardLayout