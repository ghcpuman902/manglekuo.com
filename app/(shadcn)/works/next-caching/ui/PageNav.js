'use client'
import { Separator } from "@components/ui/separator"
import Link from "next/link"

import { useSelectedLayoutSegment } from 'next/navigation'

export const PageNav = () => {
    
    const segment = useSelectedLayoutSegment()   
    const listOfExamples = [
        {path: '/', name: 'All Patterns', segment: null},
        {path: 'revalidation-bad', name: 'Revalidation: bad example', segment: 'revalidation-bad'},
        {path: 'revalidation-good', name: 'Revalidation: good example', segment: 'revalidation-good'},
        {path: 'revalidation-better', name: 'Revalidation: better example', segment: 'revalidation-better'}
    ];

    return (
       <div className="flex h-5 items-center space-x-4 text-sm" suppressHydrationWarning>
           {listOfExamples.map((example, index) => (
               <div key={index}>
                   <Link href={`/works/next-caching/${example.path}`} className={segment==example.segment?'font-bold':''}>{example.name}</Link>
                   <Separator orientation="vertical"/>
               </div>
           ))}
       </div>
   );
}