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
    // console.log(embedding);
    return embedding;
})

export async function POST(request: NextRequest) {
    const { text } = await request.json();
    // Get embedding for new text 
    let embedding = await getEmbeddingFromOpenAI(text);

    if(process.env.NODE_ENV == "development"){
        return NextResponse.json({result: embedding});
    }
    else if (process.env.NODE_ENV == "production"){
        return NextResponse.json({result: embedding}, {
            headers: {
                'Access-Control-Allow-Origin': 'https://manglekuo.com',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
            },
        });
    }
}