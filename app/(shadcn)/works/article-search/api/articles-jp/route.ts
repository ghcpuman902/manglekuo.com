export const revalidate = 3600

import { fetchAllJapanArticles } from '../../_utils/fetchRSS';

export async function GET() {
    const {articles, successfulSources, updateTime} = await fetchAllJapanArticles();
    const env = process.env.NODE_ENV;

    var expireDate = new Date(updateTime);
    expireDate.setHours(expireDate.getHours() + 1); 

    if(env === "development"){
        return Response.json({articles, successfulSources, updateTime}, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Expires': expireDate.toUTCString(),
                'Pragma': 'no-cache',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        });
    }
    else if (env === "production"){
        return Response.json({articles, successfulSources, updateTime}, {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
                'Expires': expireDate.toUTCString(),
                'Pragma': 'no-cache',
                'Access-Control-Allow-Origin': 'https://manglekuo.com',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        });
    }
}