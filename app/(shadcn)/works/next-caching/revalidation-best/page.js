export const revalidate = 20
import { TimeAgo } from "../ui/TimeAgo"

export default async function Page() {
    const res = await fetch('https://manglekuo.com/works/next-caching/api/get-bitcoin-C');

    if (!res.ok) {
        throw new Error(`Failed to fetch: ${JSON.stringify({ status: res.status }, null, 2)} `);
    }

    const resJson = await res.json();

    const btcPrice = resJson.btcPrice;
    const timestamp = resJson.timestamp;

    return (<>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Time-based Revalidation on both the page and the API - ✅ Best Example
        </h2>
        <div className="flex flex-col items-center justify-center mt-5 bg-blue-800 text-white w-[300px] h-[300px] rounded gap-y-2">
            <span>Bitcoin Price:</span>
            <code>1 BTC = </code>
            <div className="text-3xl font-bold">
                {'$' + Number(btcPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div>
                price updated: <TimeAgo timestamp={timestamp} />
            </div>
            <p className="mt-3">page rendered: <TimeAgo timestamp={new Date().toISOString()} /></p>
        </div>
    </>)
}