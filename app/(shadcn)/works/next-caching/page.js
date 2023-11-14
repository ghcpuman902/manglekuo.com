export const revalidate = 10

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

import { TimeAgo } from "./ui/TimeAgo"

import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsx from 'react-syntax-highlighter/dist/esm/languages/prism/jsx';
import prism from 'react-syntax-highlighter/dist/esm/styles/prism/prism';

SyntaxHighlighter.registerLanguage('jsx', jsx);

import { Suspense } from 'react';

export default async function Page() {
    let baseURL = process.env.NEXT_PUBLIC_URL;
    const res = await fetch(baseURL+'/works/next-caching/api/get-bitcoin-price-stale-while-revalidate');

    if (!res.ok) {
        throw new Error(`Failed to fetch: ${JSON.stringify({baseURL, env, status: res.status }, null, 2)} `);
    }
    const resJson = await res.json();
    const {
        btcPrice,
        timestamp
    } = resJson;


    return (<main className='max-w-[1000px] mx-auto my-2'>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Next.js Caching Bad Examples
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
            Once upon a time, in a far-off land, there was a very lazy king who
            spent all day lounging on his throne. One day, his advisors came to him
            with a problem: the kingdom was running out of money.
        </p>
        <div className="grid grid-cols-2 gap-x-2">
            <div><Button>Button</Button></div>
            <div><Button>Button</Button></div>
        </div>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
            Using Too Many Time-based Revalidation
        </h2>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            ✅❌ Bad Example
        </h3>
        <SyntaxHighlighter language="jsx" style={prism}>
            {`// page.js
export default async function Page({ }) {
    const env = process.env.NODE_ENV;
    let baseURL = 'https://manglekuo.com';
    if (env == "development") {
        baseURL = 'http://localhost:3000';
    }
    const res = await fetch(baseURL+'/works/next-caching/api/get-bitcoin-price-stale-while-revalidate', { next: { revalidate: 30 } });

    const resJson = await res.json();
    if (!res.ok) {
        throw new Error('Failed to fetch', resJson);
    }
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
        <SyntaxHighlighter language="jsx" style={prism}>
            {`// /api/get-bitcoin-price-stale-while-revalidate/route.ts
export const revalidate = 10

export async function GET() {
  // Wait for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Randomly generate a Bitcoin price (let's say between 30000 and 60000 for this example)
  const btcPrice = Math.random() * (60000 - 30000) + 30000;

  // Generate the current timestamp as a string
  const timestamp = new Date().toISOString();

  return Response.json({
    btcPrice,
    timestamp
  });
}
`}
        </SyntaxHighlighter>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
            The king thought long and hard, and finally came up with{" "}
            <a
                href="#"
                className="font-medium text-primary underline underline-offset-4"
            >
                a brilliant plan
            </a>
            : he would tax the jokes in the kingdom. Bitcoin Price right now: {btcPrice}, updated: <TimeAgo timestamp={timestamp} />
        </p>
    </main>);
}