import { type NextRequest, NextResponse } from 'next/server';
import { fetchAllJapanArticles } from '../../utils/fetchRSS';
export const revalidate = 3600


export async function GET(request: NextRequest) {
    const {articles, successfulSources, updateTime} = await fetchAllJapanArticles();
    const env = process.env.NODE_ENV;
    if(env == "development"){
        return NextResponse.json({articles, successfulSources, updateTime});
    }
    else if (env == "production"){
        const referer = request.headers.get('referer');
        if (!referer || !referer.startsWith('https://manglekuo.com')) {
            return NextResponse.json('Unauthorized', { status: 401 });
        }
        return NextResponse.json({articles, successfulSources, updateTime}, {
            headers: {
                'Access-Control-Allow-Origin': 'https://manglekuo.com',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json',
            },
        });
    }
}
