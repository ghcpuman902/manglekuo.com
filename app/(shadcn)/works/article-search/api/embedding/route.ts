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

    // // // Extract relevant dimensions
    // let newRelevantEmbedding = relevantDimensions.map(index => newEmbedding[index]);

    return NextResponse.json({result:embedding});
}