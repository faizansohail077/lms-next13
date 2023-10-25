"use client"
import useDebounce from '@/hooks/useDebounce'
import { SearchIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'

const SearchInput = () => {
    const [value, setValue] = useState("")
    const debounceValue = useDebounce(value)

    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const currentCategoryId = searchParams.get("categoryId")

    useEffect(() => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                categoryId: currentCategoryId,
                title: debounceValue
            }
        }, { skipEmptyString: true, skipNull: true })

        router.push(url)
    }, [debounceValue, router, pathname, currentCategoryId])


    return (
        <div className='relative ' >
            <SearchIcon className='h-4 w-4 absolute top-3 left-3 text-slate-600' />
            <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='Search For A course' className='w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200' />
        </div>
    )
}

export default SearchInput