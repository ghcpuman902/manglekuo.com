import { type NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";
import { cache } from 'react'
import { gzip, inflate } from 'pako';

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const getEmbeddingFromOpenAI = cache(async (text: string) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
    });
    const embedding = response['data'][0]['embedding'];
    return embedding;
});

export async function POST(request: NextRequest) {
    const rawData = await request.arrayBuffer();

    // Get the compressed size (in bytes) from the ArrayBuffer
    const compressedSize = rawData.byteLength;

    const decompressedData = inflate(rawData, { to: 'string' });
    
     // Convert the decompressedData to a byte array and get its length
     // This gets the size of the original uncompressed data
     const encoder = new TextEncoder();
     const byteArray = encoder.encode(decompressedData);
     const originalSize = byteArray.length;

    const { texts } = JSON.parse(decompressedData); 

    // Calculate the compression rate (as a percentage)
    const compressionRate = (compressedSize / originalSize) * 100;

    console.log(`compressionRate: ${compressionRate}`);
    
    console.time('getting embeddings');
    const embeddings = await Promise.all(texts.map(getEmbeddingFromOpenAI));
    console.timeEnd('getting embeddings');

    if(process.env.NODE_ENV == "development"){
        return new Response(gzip(JSON.stringify({result: embeddings})), {
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip'
            },
        });
    }
    else if (process.env.NODE_ENV == "production"){
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