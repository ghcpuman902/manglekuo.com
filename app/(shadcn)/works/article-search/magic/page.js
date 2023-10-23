'use client'
import { Button } from "@components/ui/button";
import { useState } from 'react';
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@components/ui/alert"

export default function Page() {
    const [revalidateText, setRevalidateText] = useState('');

    const handleRevalidateButtonClick = () => {
        const fetchData = async () => {
            const res = await fetch('/works/article-search/api/revalidate', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!res.ok) {
                throw new Error('Failed to fetch', resJson);
            }
            const resJson = await res.json();
            setRevalidateText(JSON.stringify(resJson, null, 2));
        }
        fetchData();
    }

    return (
        <div className="mt-6 mb-3 w-full flex flex-wrap justify-center">
            <Button variant='destructive' className="flex flex-nowrap whitespace-nowrap" onClick={handleRevalidateButtonClick}>Revalidate 'article' cache on server</Button>
            {revalidateText ? (<Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{revalidateText}</AlertDescription>
            </Alert>) : null}
        </div>);
}