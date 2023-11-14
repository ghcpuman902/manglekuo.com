export const metadata = {
    title: 'Next.js Bad Caching Patterns',
    description: '',
    creator: 'Mangle Kuo',
    authors: [
      {
        name: 'Mangle Kuo',
        url: 'https://github.com/ghcpuman902/',
      }
    ],
}

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


import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);

import { Suspense } from 'react';
import Link from "next/link";

let baseURL = `https://manglekuo.com`;

export default function Page() {

    return (
        <>
            <h2 id="revalidation" className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
                #1 Time-based Revalidation on both the Page and the Route Handler
            </h2>
            <p className="leading-7 max-w-[600px] [&:not(:first-child)]:mt-6">
             It's a bad idea to have time-based revalidation for both the Page and the Route Handler, let's find out why.
            </p>
            <div className="mt-6">
            <Button variant='outline' className='mr-4 border-red-400' asChild>
                <Link href="/works/next-caching/revalidation-bad">Try bad example</Link>
            </Button>
            <Button variant='outline' className='mr-4 border-blue-400' asChild>
                <Link href="/works/next-caching/revalidation-good">Try good example</Link>
            </Button>
            <Button variant='outline' className='border-green-400' asChild>
                <Link href="/works/next-caching/revalidation-better">Try better example</Link>
            </Button>
            </div>

            <p className="leading-7 max-w-[600px] [&:not(:first-child)]:mt-6">
Here we have a Page (page.js) and an API (route.ts) both using <Link href='https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate'>Route Segment Config</Link> to set <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
export const revalidate = 20</code>:
</p>

            <div className="grid grid-cols-2 gap-x-2 w-full mt-6">
                <div>
                    <SyntaxHighlighter language="jsx" style={prism} wrapLongLines={true}>
                        {`// revalidation-bad/page.js
export const revalidate = 20 //  ❌ Bad and causing problems

export default async function Page() {
    const res = await fetch('https://manglekuo.com/works/next-caching/api/get-bitcoin-A');
    const resJson = await res.json();

    const t = new Date().toISOString();
    const btcPrice = resJson.btcPrice;
    const timestamp = resJson.timestamp;

    return (<>
        <>
            <span>Bitcoin Price:</span>
            <code>1 BTC = </code>
            <p className="text-3xl font-bold">
                {'$' + Number(btcPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="">
                price updated: <TimeAgo timestamp={timestamp} />
            </p>
            <p className="mt-3">page rendered: <TimeAgo timestamp={t} /></p>
        </>
    </>)
}
`}
                    </SyntaxHighlighter>
                </div>
                <div>
                    <SyntaxHighlighter language="jsx" style={prism} wrapLongLines={true}>
                        {`// api/get-bitcoin-A/route.ts
export const revalidate = 20

export async function GET() {
  
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait

  const btcPrice = Math.random() * (60000 - 30000) + 30000;

  const timestamp = new Date().toISOString();

  return Response.json({
    btcPrice,
    timestamp
  }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
`}
                    </SyntaxHighlighter>

                </div>
            </div>
            <p className="leading-7 max-w-[600px] [&:not(:first-child)]:mt-6">
            This means they will server the cached data within 20s, and server new data when cached data is expired (after 20s). 
            </p>
            <p className="leading-7 max-w-[600px] [&:not(:first-child)]:mt-6">
            However, due to the "stale-while-revalidate" behaviour mentioned <Link href="https://nextjs.org/docs/app/building-your-application/caching#time-based-revalidation">here</Link>, that is not what the user experiences. 
            When page.js calls the API again after 20s. the API tries to server the new data, however because the new data takes 3 second to generate, it will server the "stale" data first, and attempt to get the new data in the background. Because the page.js doesnt know this is staled data, it will use this as the new data to set its cache, causing issues.
            </p>
            <p className="leading-7 max-w-[600px] [&:not(:first-child)]:mt-6">
            Have a look at this timeline table and pay attention to the{" "}
            <span className="bg-blue-200 dark:bg-blue-600 px-2 rounded-full">stale</span>
            -while-
            <span className="bg-purple-200 dark:bg-purple-600 px-2 rounded-full">revalidate</span> logic:
            </p>
            <Table className="max-w-[600px] border [&_th]:border [&_td]:border mt-6">
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
                        <TableCell className="bg-blue-200 dark:bg-blue-600">STALE ⬇️<br />⬅️<br /></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className="bg-purple-200 dark:bg-purple-600">➡️<br />SET<br /></TableCell>
                        <TableCell className="bg-purple-200 dark:bg-purple-600">⬇️<br />⬅️</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>24s</TableCell>
                        <TableCell>Requested➡️<br />Render</TableCell>
                        <TableCell>HIT ⬇️<br />⬅️</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan="5">Expected ⬇️ Reality ⬆️</TableCell>
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
    </>
    );
}

