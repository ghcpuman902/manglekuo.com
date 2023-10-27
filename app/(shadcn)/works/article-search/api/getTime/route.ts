export const revalidate = 0

export async function GET() {

        return Response.json({time: new Date().toISOString()}, );
}