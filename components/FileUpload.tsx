"use client"
import { UploadDropzone } from '@/lib/uploadthing'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import React from 'react'
import toast from 'react-hot-toast'

interface FileUploadProps {
    onChange: (url?: string) => void
    endPoint: keyof typeof ourFileRouter
}

const FileUpload = ({ endPoint, onChange }: FileUploadProps) => {
    return (
        <UploadDropzone endpoint={endPoint} onClientUploadComplete={(res) => {
            console.log(res, 'upload zone res')
            onChange(res?.[0]?.url)
        }}
            onUploadError={(error: Error) => {
                toast.error(error?.message)
            }}
        />
    )
}

export default FileUpload