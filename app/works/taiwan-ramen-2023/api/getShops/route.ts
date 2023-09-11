import { type NextRequest, NextResponse } from 'next/server'
import { getShops } from '../../utils/get-shops'

export async function GET(request: NextRequest) {
  let Shops = await getShops();
  return NextResponse.json(Shops)
}