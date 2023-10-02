import { type NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";
import { cache } from 'react'

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

const getEmbeddingFromOpenAI = cache(async (text) => {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
    });
    const embedding = response['data'][0]['embedding'];
    return embedding;
});

export async function POST(request: NextRequest) {
    const { texts } = await request.json();  
    const embeddings = await Promise.all(texts.map(getEmbeddingFromOpenAI));

    if(process.env.NODE_ENV == "development"){
        return NextResponse.json({result: embeddings});
    }
    else if (process.env.NODE_ENV == "production"){
        const referer = request.headers.get('referer');
        if (!referer || !referer.startsWith('https://manglekuo.com')) {
            return NextResponse.json('Unauthorized', { status: 401 });
        }
        return NextResponse.json({result: embeddings}, {
            headers: {
                'Access-Control-Allow-Origin': 'https://manglekuo.com',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
            },
        });
    }
}