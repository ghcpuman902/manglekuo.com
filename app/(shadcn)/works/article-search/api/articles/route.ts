import { type NextRequest, NextResponse } from 'next/server';
import { fetchAllArticles } from '../../utils/fetchRSS';
export const revalidate = 3600


export async function GET(request: NextRequest) {
    const {articles, successfulSources, updateTime} = await fetchAllArticles();
    // Compute embeddings, alignments, filter unique articles, etc...
    return NextResponse.json({articles, successfulSources, updateTime});
}
