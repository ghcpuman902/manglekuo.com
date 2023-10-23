import { NextRequest } from 'next/server'
import { revalidateTag } from 'next/cache'
 
export async function DELETE(request: NextRequest) {
  revalidateTag('articles')
  return Response.json({ revalidated: true, now: new Date().toUTCString() })
}