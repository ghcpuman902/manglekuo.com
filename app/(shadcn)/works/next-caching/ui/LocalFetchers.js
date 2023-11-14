'use client'
import { Label } from "@components/ui/label";
import { Button } from "@components/ui/button"
import { TimeAgo } from "./TimeAgo"

import { useEffect, useState } from "react";

export function LocalFetcherOne() {
    const [btcPrice, setBtcPrice] = useState('');
    const [timestamp, setTimeStamp] = useState('');

    const fetchData = async () => {
        // const res = await fetch('https://manglekuo.com/works/next-caching/api/get-bitcoin-A', { next: { revalidate: 20 } });

        // if (!res.ok) {
        //     throw new Error(`Failed to fetch: ${JSON.stringify({ baseURL, env: process.env, status: res.status }, null, 2)} `);
        // }

        // const resJson = await res.json();
        // setBtcPrice(resJson.btcPrice);
        // setTimeStamp(resJson.timestamp);
    }

    return (
        <div className="border border-red-400 rounded p-4">
            <Button variant="outline" onClick={() => { fetchData(); }}>get bitcoin price</Button>
            <div className="flex flex-col items-center justify-center mt-5 bg-blue-800 text-white w-[300px] h-[300px] rounded gap-y-2">
                <span>Bitcoin Price:</span>
                <code>1 BTC = </code>
                <p className="text-3xl font-bold mb-4">
                    {'$' + Number(btcPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="">
                    updated: <TimeAgo timestamp={timestamp} className="font-light" />
                </p>
            </div>
        </div>
    )
}
