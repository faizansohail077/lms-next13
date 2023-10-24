import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ToastProvider from '@/components/providers/toast-providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LMS',
  description: 'Learning Management System By faizansohail077@gmail.com',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
