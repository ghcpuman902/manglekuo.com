export const revalidate = 20
import Link from "next/link";
import { TimeAgo } from "../ui/TimeAgo"
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);

export default async function Page() {
    const res = await fetch('https://manglekuo.com/works/next-caching/api/get-bitcoin-C');

    if (!res.ok) {
        throw new Error(`Failed to fetch: ${JSON.stringify({ baseURL, env: process.env, status: res.status }, null, 2)} `);
    }

    const resJson = await res.json();

    const t = new Date().toISOString();
    const btcPrice = resJson.btcPrice;
    const timestamp = resJson.timestamp;

    return (<>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        Time-based Revalidation on both the Page and the Route Handler - ✅ Better Example
        </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6 mb-4">
                Try refreshing the page. Expected behaviour is the price should update every 20s.
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6 mb-4">
                However having both the page.js and the route.ts set to revalidate = 20 created issue and now the user is seeing old data even after page refreshed. <Link href='/works/next-caching/#revalidation'>Read more</Link>.
            </p>
        <div className="flex flex-col items-center justify-center mt-5 bg-blue-800 text-white w-[300px] h-[300px] rounded gap-y-2">
            <span>Bitcoin Price:</span>
            <code>1 BTC = </code>
            <p className="text-3xl font-bold">
                {'$' + Number(btcPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="">
                price updated: <TimeAgo timestamp={timestamp} />
            </p>
            <p className="mt-3">page rendered: <TimeAgo timestamp={t} /></p>
        </div>

        <SyntaxHighlighter language="jsx" style={prism} wrapLongLines={true}>{`export`}</SyntaxHighlighter>
    </>)
}