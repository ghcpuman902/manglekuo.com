import pLimit from 'p-limit';
import { type NextRequest, NextResponse } from 'next/server'

import { gzip, inflate } from 'pako';

async function getEmbedding(text: string, host: string | null) {
    try {
        let urlPrefix;
        host = host ? host : 'localhost:3000'
        if (host.includes('localhost') || host.includes('.local')) {
            urlPrefix = 'http://' + host;
        } else {
            urlPrefix = 'https://' + host;
        }
        var myHeaders = new Headers();
        myHeaders.append("Referer", "https://manglekuo.com");
        myHeaders.append("Content-Type", "application/json");
        const res = await fetch(urlPrefix + "/works/article-search/api/internal_embedding", {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({ "text": text, "key": process.env.OPENAI_KEY }),
            cache: 'force-cache'
        });

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        const resJson = await res.json();
        return resJson.result?resJson.result:[];
    } catch (error) {
        console.error(`Fetch to get embedding failed with message: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
        if ('type' in error) {
           console.error(`Error type: ${error.type}`);
        }
        throw error; // or handle error appropriately
    }
}
export async function POST(request: NextRequest) {
    const rawData = await request.arrayBuffer();

    const decompressedData = inflate(rawData, { to: 'string' });

    const { texts } = JSON.parse(decompressedData);


    try {
        let embeddings;
        const limit = pLimit(150);
        // Use p-limit to execute the promises with controlled concurrency
        const tasks = texts.map((text) => {
            return limit(() => getEmbedding(text, request.headers.get('host')));
        });
        embeddings = await Promise.all(tasks);
        if (process.env.NODE_ENV == "development") {
            return new Response(gzip(JSON.stringify({ result: embeddings })), {
                headers: {
                    'Access-Control-Allow-Origin': 'https://manglekuo.com',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'gzip'
                },
            });
        } else if (process.env.NODE_ENV == "production") {
            const referer = request.headers.get('referer');
            if (!referer || !referer.startsWith('https://manglekuo.com')) {
                return NextResponse.json('Unauthorized', { status: 401 });
            }
            return new Response(gzip(JSON.stringify({ result: embeddings })), {
                headers: {
                    'Access-Control-Allow-Origin': 'https://manglekuo.com',
                    'Access-Control-Allow-Methods': 'POST',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Content-Type': 'application/json',
                    'Content-Encoding': 'gzip'
                },
            });
        }
    } catch (error) {
        console.error(`Error with getting embeddings: ${error}`);
        return NextResponse.json(error, { status: 403 });
    }


}