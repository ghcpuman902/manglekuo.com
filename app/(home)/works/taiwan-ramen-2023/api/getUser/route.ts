import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers';

import { getUser, updateUser } from '../../utils/user'

export async function GET(request: NextRequest) {

  const cookieStore = cookies()
  let userProfile = await getUser();
  if(cookieStore.get('email')?.value && cookieStore.get('name')?.value && cookieStore.get('picture')?.value){
    // all good
  }else{
    cookieStore.delete('g_state');
    cookieStore.delete('email');
    cookieStore.delete('name');
    cookieStore.delete('picture');
    if (cookieStore.get('email')?.value !== '' || cookieStore.get('name')?.value !== '' || cookieStore.get('picture')?.value !== '') {
      throw new Error('cookie can not be deleted');
    }
    console.log(`not logged in or abnormal, cookie clean success time: ${new Date().toISOString()}`);
  }
  return NextResponse.json(userProfile)
}


export async function PATCH(request: NextRequest) {
  const {shopId, shopChange} = await request.json();
  console.log(shopId,shopChange);

  let userProfile = await updateUser({shopId, shopChange});

  return NextResponse.json(userProfile);
}