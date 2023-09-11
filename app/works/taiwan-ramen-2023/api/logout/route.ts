import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function DELETE(request: NextRequest) {
  try {
    cookies().delete('g_state');
    cookies().delete('email');
    cookies().delete('name');
    cookies().delete('picture');
    if (cookies().get('email')?.value !== '' || cookies().get('name')?.value !== '' || cookies().get('picture')?.value !== '') {
      throw new Error('cookie can not be deleted');
      console.error('cookie can not be deleted');
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 403 })
  }
  return NextResponse.json({});
}