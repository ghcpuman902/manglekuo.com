import { type NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai';
import { gzip, inflate } from 'pako';
import { kv } from '@vercel/kv';

function customHash(text) {
    const str = text.split("").map(char => char.charCodeAt(0).toString(16)).join('');
    const firstTen = str.slice(0, 10);
    const lastTen = str.slice(-10);
    const totalCharCount = str.length.toString();
    let hash = firstTen + lastTen + totalCharCount;
    return hash;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const getEmbeddingFromOpenAI = async (text: string) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
    });
    const embedding = response['data'][0]['embedding'];
    return embedding;
};

export async function POST(request: NextRequest) {
    const rawData = await request.arrayBuffer();

    const decompressedData = inflate(rawData, { to: 'string' });

    const { texts } = JSON.parse(decompressedData); 

    const embeddings = await Promise.all(texts.map(async text => {
        // const dependencyHash = "AS::" + crypto.createHash('md5').update(text).digest("hex");
        const dependencyHash = 'AS::' + customHash(text);
        const cachedEmbeddings = await kv.get(dependencyHash);

        if(cachedEmbeddings) {
            // console.log('Cache hit:', dependencyHash);
            return cachedEmbeddings;
        }

        // console.log('Cache miss:', dependencyHash);
        const embedding = await getEmbeddingFromOpenAI(text);
        // Store the new value in the cache for 30 days.
        await kv.set(dependencyHash, JSON.stringify(embedding), { ex: 30 * 24 * 60 * 60 });
        return embedding;
    }));

    if(process.env.NODE_ENV == "development"){
        return new Response(gzip(JSON.stringify({result: embeddings})), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip'
            },
        });
    } else if (process.env.NODE_ENV == "production") {
        const referer = request.headers.get('referer');
        if (!referer || !referer.startsWith('https://manglekuo.com')) {
            return NextResponse.json('Unauthorized', { status: 401 });
        }
        return new Response(gzip(JSON.stringify({result: embeddings})), {
            headers: {
                'Access-Control-Allow-Origin': 'https://manglekuo.com',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip'
            },
        });
    }
}