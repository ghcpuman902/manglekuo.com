export const revalidate = 3600

import { fetchAllArticles } from '../../_utils/fetchRSS';

export async function GET() {
    const {articles, successfulSources, updateTime} = await fetchAllArticles();
    const env = process.env.NODE_ENV;
    if(env == "development"){
        return Response.json({articles, successfulSources, updateTime}, {
            headers: {
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            }
        });
    }
    else if (env == "production"){
        return Response.json({articles, successfulSources, updateTime}, {
            headers: {
                'Access-Control-Allow-Origin': 'https://manglekuo.com',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'no-store',
                'Content-Type': 'application/json',
            },
        });
    }
}
