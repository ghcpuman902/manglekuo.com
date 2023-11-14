import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@components/ui/table"
import { Button } from "@components/ui/button"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@components/ui/accordion"


import { TimeAgo } from "./ui/TimeAgo"
import { LocalFetcherOne, LocalFetcherTwo } from "./ui/LocalFetchers"

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);

import { Suspense } from 'react';

let baseURL = `https://manglekuo.com` || process.env.NEXT_PUBLIC_URL;

const BitcoinInfoBad = async () => {

    try {
        const res = await fetch(baseURL + '/works/next-caching/api/get-bitcoin-A', { next: { revalidate: 20 } });

        if (!res.ok) {
            if (process.env.NEXT_PHASE == 'phase-production-build' && res.status == 404) {
                console.log(`API end point not found because they are not deployed yet, will continue with build and pre-rendering this page as empty ${JSON.stringify({ baseURL, status: res.status })}`);
                return null;
            } else {
                throw new Error(`Failed to fetch: ${JSON.stringify({ baseURL, env: process.env, status: res.status }, null, 2)} `);
            }
        }

        const resJson = await res.json();
        const resHeaders = {};

        for (const pair of res.headers.entries()) {
            resHeaders[pair[0]] = pair[1];
        }
        const {
            btcPrice,
            timestamp
        } = resJson;

        return (
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
        )
    } catch (error) {
        console.error(`Failed to fetch: ${JSON.stringify({ error, baseURL }, null, 2)} `);
    }
}

const BitcoinInfoGood = async () => {

    try {
        const res = await fetch(baseURL + '/works/next-caching/api/get-bitcoin-B', { next: { revalidate: 0 } });

        if (!res.ok) {
            if (process.env.NEXT_PHASE == 'phase-production-build' && res.status == 404) {
                console.log(`API end point not found because they are not deployed yet, will continue with build and pre-rendering this page as empty ${JSON.stringify({ baseURL, status: res.status })}`);
                return null;
            } else {
                throw new Error(`Failed to fetch: ${JSON.stringify({ baseURL, env: process.env, status: res.status }, null, 2)} `);
            }
        }

        const resJson = await res.json();

        const {
            btcPrice,
            timestamp
        } = resJson;

        return (
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
        )
    } catch (error) {
        console.error(`Failed to fetch: ${JSON.stringify({ error, baseURL }, null, 2)} `);
    }
}


export default function Page() {

    return (<main className='max-w-[1000px] ml-6 m-2'>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Next.js Caching Bad Examples
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                This is some example of bad caching pattern in next.js
            </p>
            <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                Time-based Revalidation on both the page and the API
            </h2>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                Try to refresh the page, for the Bad Example even tho we expect the data to revalidate every 20s, using it both on the page and at the API end point will cause the data
            </p>

            <LocalFetcherOne />









            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                ❌ Bad Example
            </h3>
            <Suspense fallback={`loading...`}>
                <BitcoinInfoBad />
            </Suspense>
            <div className="grid grid-cols-2 gap-x-2  w-screen">
                <div>
                    <SyntaxHighlighter language="jsx" style={prism} wrapLongLines={true}>
                        {`// page.js
    const res = await fetch( process.env.NEXT_PUBLIC_URL + '/works/next-caching/api/get-bitcoin-price-stale-while-revalidate', { next: { revalidate: 20 } });
    const resJson = await res.json();
    const {
        btcPrice,
        timestamp
    } = resJson;

    return (<p>
            Bitcoin Price right now: {btcPrice}, updated: <TimeAgo timestamp={timestamp} />
        </p>);
}
`}
                    </SyntaxHighlighter>
                    {/* <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Show complete code for page.js</AccordionTrigger>
                        <AccordionContent>
                            <SyntaxHighlighter language="jsx" style={prism} wrapLongLines={true}>
                                {`// page.js
    let baseURL = process.env.NEXT_PUBLIC_URL;
    const res = await fetch(baseURL + '/works/next-caching/api/get-bitcoin-price-stale-while-revalidate', { next: { revalidate: 20 } });

    if (!res.ok) {
        if (process.env.NEXT_PHASE == 'phase-production-build' && res.status == 404) {
            console.log(\`API end point not found because they are not deployed yet, will continue with build and pre-rendering this page as empty \${JSON.stringify({ baseURL, status: res.status })}\`);
            return null;
        } else {
            throw new Error(\`Failed to fetch: \${JSON.stringify({ baseURL, env: process.env, status: res.status }, null, 2)} \`);
        }
    }

    const resJson = await res.json();
    const {
        btcPrice,
        timestamp
    } = resJson;

    return (<main className='max-w-[1000px] mx-auto my-2'>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
            Bitcoin Price right now: {btcPrice}, updated: <TimeAgo timestamp={timestamp} />
        </p>
    </main>);
}
`}
                            </SyntaxHighlighter>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion> */}
                </div>
                <div>
                    <SyntaxHighlighter language="jsx" style={prism}>
                        {`// /api/get-bitcoin-price-stale-while-revalidate/route.ts
export const revalidate = 20

export async function GET() {
  
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait

  const btcPrice = Math.random() * (60000 - 30000) + 30000;

  const timestamp = new Date().toISOString();

  return Response.json({
    btcPrice,
    timestamp
  });
}
`}
                    </SyntaxHighlighter>

                </div>
            </div>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
                Refreshing the page reveals a problem with the 'Bad Example' caching strategy. Although the intention is to revalidate data every 20 seconds,
                configuring both the page and API to do so can result in showing data that may be older than expected by a few seconds. This discrepancy is due to the data fetching
                duration at the API endpoint, which takes an extra 3 seconds to process. The following table walks you through different moments in time and helps visualize this issue:
            </p>
            <Table className="w-[600px] border [&_th]:border [&_td]:border">
                <TableCaption>A timeline illustrating the interaction between page and API caching with time-based revalidation.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-3">Time</TableHead>
                        <TableHead className="w-5">Page</TableHead>
                        <TableHead>Page Cache</TableHead>
                        <TableHead>API Cache</TableHead>
                        <TableHead>Data Source</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell>0s</TableCell>
                        <TableCell>Requested➡️<br />Render</TableCell>
                        <TableCell>MISS➡️<br />⬅️SET</TableCell>
                        <TableCell>MISS➡️<br />⬅️SET</TableCell>
                        <TableCell>⬇️<br />⬅️</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>10s</TableCell>
                        <TableCell>Requested➡️<br />Render</TableCell>
                        <TableCell>HIT ⬇️<br />⬅️</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>21s</TableCell>
                        <TableCell>Requested➡️<br />Render<br /> </TableCell>
                        <TableCell>MISS➡️<br />⬅️SET<br /></TableCell>
                        <TableCell className="bg-blue-400">STALE ⬇️<br />⬅️<br /></TableCell>
                        <TableCell className="bg-blue-400"></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="bg-blue-400">➡️<br />SET<br /></TableCell>
                        <TableCell className="bg-blue-400">⬇️<br />⬅️</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>24s</TableCell>
                        <TableCell>Requested➡️<br />Render</TableCell>
                        <TableCell>*HIT* ⬇️<br />⬅️</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="bg-gray-50" colSpan="5">Expected ⬇️ Reality ⬆️</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>24s</TableCell>
                        <TableCell>Requested➡️<br />Render</TableCell>
                        <TableCell>MISS<br />SET</TableCell>
                        <TableCell>HIT ⬇️<br />⬅️</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <p className="mt-4 leading-7">
                Notice the <span className="bg-blue-400 px-1">stale-while-revalidate</span> logic on the API causes the page cache to think the STALE data is fresh new data.
            </p>
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                ✅ Better Example
            </h3>
            <Suspense fallback={`loading...`}>
                <BitcoinInfoGood />
            </Suspense>
            <div className="grid grid-cols-2 gap-x-2  w-screen">
                <div>
                    <SyntaxHighlighter language="jsx" style={prism} wrapLongLines={true}>
                        {`// page.js
    const res = await fetch( process.env.NEXT_PUBLIC_URL + '/works/next-caching/api/get-bitcoin-price-stale-while-revalidate', { next: { revalidate: 0 } });
    const resJson = await res.json();
    const {
        btcPrice,
        timestamp
    } = resJson;

    return (<p>
            Bitcoin Price right now: {btcPrice}, updated: <TimeAgo timestamp={timestamp} />
        </p>);
}
`}
                    </SyntaxHighlighter>
                </div>
                <div>
                    <SyntaxHighlighter language="jsx" style={prism}>
                        {`// /api/get-bitcoin-price-stale-while-revalidate/route.ts
export const revalidate = 20

export async function GET() {
  
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait

  const btcPrice = Math.random() * (60000 - 30000) + 30000;

  const timestamp = new Date().toISOString();

  return Response.json({
    btcPrice,
    timestamp
  });
}
`}
                    </SyntaxHighlighter>

                </div>
            </div>
            {/* <SyntaxHighlighter language="jsx" style={prism}>
            {JSON.stringify(resHeaders, null, 2)}
        </SyntaxHighlighter> */}
    </main>
    );
}

