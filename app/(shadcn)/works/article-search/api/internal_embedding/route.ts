import { type NextRequest, NextResponse } from 'next/server'
import OpenAI from "openai";

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
    const { text, key } = await request.json();
    const referer = request.headers.get('referer');
    if (!referer || !referer.startsWith('https://manglekuo.com') || key != process.env.APP_INTERNAL_API_KEY) {
        return NextResponse.json('Unauthorized', { status: 401 });
    }
    // Get embedding for new text 
    try {
        let embedding = await getEmbeddingFromOpenAI(text);
        return NextResponse.json({ result: embedding }, {
            headers: {
                'Access-Control-Allow-Origin': 'https://manglekuo.com',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(`Error with getting embeddings from OpenAI`,{ text, key, referer: request.headers.get('referer') });
        return NextResponse.json({ result: error }, {
            headers: {
                'Access-Control-Allow-Origin': 'https://manglekuo.com',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
            },
        });
    }
}