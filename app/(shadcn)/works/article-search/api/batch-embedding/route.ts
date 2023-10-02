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
    return NextResponse.json({result:embeddings});
}